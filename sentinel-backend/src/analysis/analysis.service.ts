import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Analysis,
  AnalysisDocument,
  ToxicityLevel,
  Severity,
  DetectedWord,
} from './schemas/analysis.schema';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { QueryAnalysisDto } from './dto/query-analysis.dto';
import {
  AnalysisResponse,
  AnalysisListItem,
  PaginatedAnalysisResponse,
} from './interfaces/analysis-response.interface';
import { OpenAIService } from './openai.service';
import { ModerationService } from '../moderation/moderation.service';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(
    @InjectModel(Analysis.name) private analysisModel: Model<AnalysisDocument>,
    private openAIService: OpenAIService,
    private moderationService: ModerationService,
  ) {}

  /**
   * Matnni tahlil qilish va natijani saqlash
   */
  async analyzeText(
    createAnalysisDto: CreateAnalysisDto,
  ): Promise<AnalysisResponse> {
    const { text, userId } = createAnalysisDto;

    let analysisResult;

    try {
      // OpenAI yordamida tahlil qilish (birinchi usul)
      this.logger.log('OpenAI yordamida tahlil qilinmoqda...');
      analysisResult = await this.openAIService.analyzeToxicity(text);
      this.logger.log('OpenAI tahlili muvaffaqiyatli bajarildi');
    } catch (error) {
      // Agar OpenAI ishlamasa, fallback pattern-based tahlilga o'tish
      this.logger.warn(
        `OpenAI tahlil xatosi: ${error.message}. Pattern-based tahlilga o'tilmoqda...`,
      );
      analysisResult = this.performToxicityAnalysis(text);
    }

    // MongoDB ga saqlash
    const analysis = new this.analysisModel({
      originalText: text,
      toxicityLevel: analysisResult.toxicityLevel,
      toxicityScore: analysisResult.toxicityScore,
      aggressionScore: analysisResult.aggressionScore,
      offenseScore: analysisResult.offenseScore,
      threatScore: analysisResult.threatScore,
      detectedWords: analysisResult.detectedWords,
      userId: userId ? new Types.ObjectId(userId) : undefined,
    });

    const savedAnalysis = await analysis.save();

    // Agar matn toksik yoki shubhali bo'lsa, moderatsiya uchun qo'shish
    if (
      (analysisResult.toxicityLevel === ToxicityLevel.TOKSIK ||
        analysisResult.toxicityLevel === ToxicityLevel.SHUBHALI) &&
      userId
    ) {
      try {
        await this.moderationService.createModerationItem({
          content: text,
          toxicityLevel: analysisResult.toxicityLevel,
          toxicityScore: analysisResult.toxicityScore,
          submittedBy: userId,
        });
        this.logger.log(`Moderatsiya elementi yaratildi: ${savedAnalysis._id}`);
      } catch (error) {
        this.logger.error(
          `Moderatsiya elementi yaratishda xatolik: ${error.message}`,
        );
        // Xatolik bo'lsa ham, analysis natijasini qaytaramiz
      }
    }

    return this.formatAnalysisResponse(savedAnalysis);
  }

  /**
   * Foydalanuvchining tahlil tarixini olish
   */
  async getUserHistory(
    userId: string,
    queryDto: QueryAnalysisDto,
  ): Promise<PaginatedAnalysisResponse> {
    const { page, pageSize, sortBy, sortOrder } = queryDto;

    const skip = (page - 1) * pageSize;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [results, total] = await Promise.all([
      this.analysisModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.analysisModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return {
      results: results.map((item) => this.formatListItem(item)),
      total,
      page,
      pageSize,
    };
  }

  /**
   * Tahlilni ID boyicha olish
   */
  async getAnalysisById(analysisId: string): Promise<AnalysisResponse> {
    if (!Types.ObjectId.isValid(analysisId)) {
      throw new BadRequestException("Noto'g'ri ID formati");
    }

    const analysis = await this.analysisModel.findById(analysisId).exec();

    if (!analysis) {
      throw new NotFoundException('Tahlil topilmadi');
    }

    return this.formatAnalysisResponse(analysis);
  }

  /**
   * Tahlilni o'chirish
   */
  async deleteAnalysis(analysisId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(analysisId)) {
      throw new BadRequestException("Noto'g'ri ID formati");
    }

    const analysis = await this.analysisModel.findById(analysisId).exec();

    if (!analysis) {
      throw new NotFoundException('Tahlil topilmadi');
    }

    // Faqat o'z tahlilini o'chirishi mumkin
    if (analysis.userId?.toString() !== userId) {
      throw new BadRequestException("Sizda bu tahlilni o'chirish huquqi yo'q");
    }

    await this.analysisModel.findByIdAndDelete(analysisId).exec();
  }

  /**
   * PRIVATE: Toxicity tahlil qilish (AI model integration)
   * O'zbek tilida toksik matnlarni aniqlash
   */
  private performToxicityAnalysis(text: string): {
    toxicityLevel: ToxicityLevel;
    toxicityScore: number;
    detectedWords: DetectedWord[];
    aggressionScore: number;
    offenseScore: number;
    threatScore: number;
  } {
    const lowerText = text.toLowerCase();
    const detectedWords: DetectedWord[] = [];
    let toxicityScore = 0;
    let aggressionScore = 0;
    let offenseScore = 0;
    let threatScore = 0;

    // 1. TAHDID IBORALARI (Eng xavfli - 80-100 ball)
    const threatPatterns = [
      {
        pattern: /qidirib\s*topaman/gi,
        word: 'qidirib topaman',
        score: 90,
        severity: Severity.HIGH,
      },
      {
        pattern: /pushaymon\s*(qil|qildiraman)/gi,
        word: 'pushaymon qildiraman',
        score: 90,
        severity: Severity.HIGH,
      },
      {
        pattern: /yoqib\s*(yubor|yuboraman)/gi,
        word: 'yoqib yuboraman',
        score: 95,
        severity: Severity.HIGH,
      },
      {
        pattern: /o\'ldir(aman|imiz|asiz)/gi,
        word: "o'ldiraman",
        score: 100,
        severity: Severity.HIGH,
      },
      {
        pattern: /halokatga\s*uchrat/gi,
        word: 'halokatga uchrataman',
        score: 95,
        severity: Severity.HIGH,
      },
      {
        pattern: /zarar\s*yetkazaman/gi,
        word: 'zarar yetkazaman',
        score: 85,
        severity: Severity.HIGH,
      },
      {
        pattern: /uraman|kaltaklayaman/gi,
        word: 'uraman/kaltaklayaman',
        score: 85,
        severity: Severity.HIGH,
      },
      {
        pattern: /qasos\s*olaman/gi,
        word: 'qasos olaman',
        score: 80,
        severity: Severity.HIGH,
      },
      {
        pattern: /tinchligingni\s*buzaman/gi,
        word: 'tinchligingni buzaman',
        score: 75,
        severity: Severity.HIGH,
      },
      {
        pattern: /(unutmayman|eslab\s*qolaman|yodimda\s*qoladi)/gi,
        word: 'unutmayman',
        score: 70,
        severity: Severity.HIGH,
      },
    ];

    // 2. HAQORAT SO'ZLARI (50-80 ball)
    const insultWords = [
      { word: 'ahmoq', score: 60, severity: Severity.HIGH },
      { word: 'axmoq', score: 60, severity: Severity.HIGH }, // h/x varianti
      { word: 'tentak', score: 65, severity: Severity.HIGH },
      { word: "bema'ni", score: 50, severity: Severity.MEDIUM },
      { word: 'jinni', score: 55, severity: Severity.MEDIUM },
      { word: 'hayvon', score: 70, severity: Severity.HIGH },
      { word: 'xayvon', score: 70, severity: Severity.HIGH }, // h/x varianti
      { word: 'itdek', score: 75, severity: Severity.HIGH },
      { word: 'itni', score: 75, severity: Severity.HIGH },
      { word: 'itning', score: 75, severity: Severity.HIGH },
      { word: 'itday', score: 75, severity: Severity.HIGH },
      { word: 'nopok', score: 70, severity: Severity.HIGH },
      { word: 'iflos', score: 65, severity: Severity.HIGH },
      { word: 'axlat', score: 60, severity: Severity.MEDIUM },
      { word: 'yirtqich', score: 55, severity: Severity.MEDIUM },
      { word: 'yirtqix', score: 55, severity: Severity.MEDIUM }, // h/x varianti
      { word: 'nomard', score: 60, severity: Severity.MEDIUM },
      { word: 'qahramon', score: 45, severity: Severity.MEDIUM },
      { word: 'qaxramon', score: 45, severity: Severity.MEDIUM }, // h/x varianti
      { word: 'dangasa', score: 40, severity: Severity.LOW },
      { word: 'bezor', score: 45, severity: Severity.LOW },
    ];

    // 3. SO'KINISH VA QO'POL SO'ZLAR (60-90 ball)
    const profanityWords = [
      { word: "la'nat", score: 70, severity: Severity.HIGH },
      { word: 'shayton', score: 60, severity: Severity.MEDIUM },
      { word: 'jin urdi', score: 55, severity: Severity.MEDIUM },
      { word: "do'zax", score: 65, severity: Severity.HIGH },
      { word: 'yongin', score: 60, severity: Severity.MEDIUM },
    ];

    // 4. KAMSITUVCHI VA DISKRIMINATSIYA SO'ZLARI (50-80 ball)
    const discriminatoryWords = [
      { word: 'xor', score: 60, severity: Severity.HIGH },
      { word: 'past', score: 55, severity: Severity.MEDIUM },
      { word: 'nopok', score: 70, severity: Severity.HIGH },
      { word: 'qaroqchi', score: 65, severity: Severity.HIGH },
      { word: "yolg'onchi", score: 50, severity: Severity.MEDIUM },
    ];

    // TAHDID IBORALARINI TEKSHIRISH
    threatPatterns.forEach(({ pattern, word, score, severity }) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          const index = text.toLowerCase().indexOf(match.toLowerCase());
          detectedWords.push({
            word: match,
            position: index,
            severity,
          });
          toxicityScore += score;
          threatScore += score; // Tahdid kategoriyasi
        });
      }
    });

    // HAQORAT SO'ZLARINI TEKSHIRISH
    insultWords.forEach(({ word, score, severity }) => {
      const index = lowerText.indexOf(word);
      if (index !== -1) {
        detectedWords.push({
          word,
          position: index,
          severity,
        });
        toxicityScore += score;
        offenseScore += score; // Haqorat kategoriyasi
      }
    });

    // SO'KINISH VA QO'POL SO'ZLARNI TEKSHIRISH
    profanityWords.forEach(({ word, score, severity }) => {
      const index = lowerText.indexOf(word);
      if (index !== -1) {
        detectedWords.push({
          word,
          position: index,
          severity,
        });
        toxicityScore += score;
        offenseScore += score; // Haqorat kategoriyasi
      }
    });

    // KAMSITUVCHI SO'ZLARNI TEKSHIRISH
    discriminatoryWords.forEach(({ word, score, severity }) => {
      const index = lowerText.indexOf(word);
      if (index !== -1) {
        detectedWords.push({
          word,
          position: index,
          severity,
        });
        toxicityScore += score;
        offenseScore += score; // Haqorat kategoriyasi
      }
    });

    // QOSHIMCHA KONTEKST TAHLILI
    // Ko'p undov belgilar
    const exclamationCount = (text.match(/!/g) || []).length;
    if (exclamationCount > 2) {
      const aggressionBonus = exclamationCount * 3;
      toxicityScore += aggressionBonus;
      aggressionScore += aggressionBonus;
    }

    // Ko'p savol belgilar
    const questionCount = (text.match(/\?{2,}/g) || []).length;
    if (questionCount > 0) {
      const aggressionBonus = questionCount * 5;
      toxicityScore += aggressionBonus;
      aggressionScore += aggressionBonus;
    }

    // CAPS LOCK (baqirish)
    const upperCaseRatio =
      (text.match(/[A-ZА-ЯЎҒҚҲЎʻ]/g) || []).length / text.length;
    if (upperCaseRatio > 0.5 && text.length > 10) {
      toxicityScore += 20;
      aggressionScore += 25; // CAPS LOCK agressivlikni bildiradi
    }

    // Uzun undov belgilar ketma-ketligi
    if (/!{3,}/.test(text)) {
      toxicityScore += 15;
      aggressionScore += 20; // Ko'p undov agressivlik belgisi
    }

    // Score ni 0-100 oralig'ida qo'yish
    toxicityScore = Math.min(Math.round(toxicityScore), 100);
    aggressionScore = Math.min(Math.round(aggressionScore), 100);
    offenseScore = Math.min(Math.round(offenseScore), 100);
    threatScore = Math.min(Math.round(threatScore), 100);

    // Toxicity level aniqlash
    let toxicityLevel: ToxicityLevel;
    if (toxicityScore < 30) {
      toxicityLevel = ToxicityLevel.XAVFSIZ;
    } else if (toxicityScore < 70) {
      toxicityLevel = ToxicityLevel.SHUBHALI;
    } else {
      toxicityLevel = ToxicityLevel.TOKSIK;
    }

    return {
      toxicityLevel,
      toxicityScore,
      detectedWords,
      aggressionScore,
      offenseScore,
      threatScore,
    };
  }

  /**
   * Analysis dokumentini response formatiga o'zgartirish
   */
  private formatAnalysisResponse(analysis: AnalysisDocument): AnalysisResponse {
    return {
      id: analysis._id.toString(),
      originalText: analysis.originalText,
      toxicityLevel: analysis.toxicityLevel,
      toxicityScore: analysis.toxicityScore,
      aggressionScore: analysis.aggressionScore,
      offenseScore: analysis.offenseScore,
      threatScore: analysis.threatScore,
      detectedWords: analysis.detectedWords,
      timestamp: analysis.createdAt,
      userId: analysis.userId?.toString(),
    };
  }

  /**
   * List item formatiga o'zgartirish
   */
  private formatListItem(analysis: AnalysisDocument): AnalysisListItem {
    return {
      id: analysis._id.toString(),
      text: analysis.originalText,
      toxicityLevel: analysis.toxicityLevel,
      toxicityScore: analysis.toxicityScore,
      aggressionScore: analysis.aggressionScore,
      offenseScore: analysis.offenseScore,
      threatScore: analysis.threatScore,
      analyzedAt: analysis.createdAt,
      detectedWords: analysis.detectedWords,
    };
  }
}
