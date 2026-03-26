import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  ToxicityLevel,
  Severity,
  DetectedWord,
} from './schemas/analysis.schema';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      this.logger.warn(
        'OpenAI API key not configured. Using fallback analysis.',
      );
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * OpenAI yordamida matnni tahlil qilish
   * GPT-4o-mini modelidan foydalaniladi (arzon va tez)
   */
  async analyzeToxicity(text: string): Promise<{
    toxicityLevel: ToxicityLevel;
    toxicityScore: number;
    detectedWords: DetectedWord[];
    aggressionScore: number;
    offenseScore: number;
    threatScore: number;
  }> {
    try {
      const prompt = `Sen o'zbek tilida yozilgan matnlarning toksiklik darajasini aniqlaydigan AI assistantsan.

Quyidagi matnni tahlil qil va JSON formatida javob ber:

Matn: "${text}"

Tahlil mezonlari:
1. toxicityScore (0-100): Umumiy toksiklik darajasi
2. aggressionScore (0-100): Tajovuz va agressivlik darajasi
3. offenseScore (0-100): Haqorat va kamsitish darajasi
4. threatScore (0-100): Tahdid va qo'rqitish darajasi
5. detectedWords: Topilgan toksik so'zlar ro'yxati (har biri: word, position, severity: "low"/"medium"/"high")

Javobni faqat JSON formatida ber, boshqa hech narsa qo'shma:

{
  "toxicityScore": 0,
  "aggressionScore": 0,
  "offenseScore": 0,
  "threatScore": 0,
  "detectedWords": [
    {
      "word": "toksik so'z",
      "position": 0,
      "severity": "high"
    }
  ]
}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Arzon va tez model
        messages: [
          {
            role: 'system',
            content:
              "Sen o'zbek tilida matn toksikligini aniqlaydigan professional tahlilchisan. Faqat JSON formatida javob berasan.",
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Past temperature aniqroq natija beradi
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const responseText = completion.choices[0]?.message?.content;

      if (!responseText) {
        throw new Error('OpenAI dan javob kelmadi');
      }

      const analysis = JSON.parse(responseText);

      // Ensure scores are within 0-100 range
      const toxicityScore = Math.min(
        Math.max(analysis.toxicityScore || 0, 0),
        100,
      );
      const aggressionScore = Math.min(
        Math.max(analysis.aggressionScore || 0, 0),
        100,
      );
      const offenseScore = Math.min(
        Math.max(analysis.offenseScore || 0, 0),
        100,
      );
      const threatScore = Math.min(Math.max(analysis.threatScore || 0, 0), 100);

      // Convert severity strings to enum
      const detectedWords: DetectedWord[] = (analysis.detectedWords || []).map(
        (word: any) => ({
          word: word.word,
          position: word.position,
          severity: this.convertToSeverity(word.severity),
        }),
      );

      // Determine toxicity level based on score
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
    } catch (error) {
      this.logger.error(`OpenAI tahlil xatosi: ${error.message}`, error.stack);

      // Agar OpenAI ishlamasa, xatoni yuqoriga uzatish (fallback ga o'tadi)
      throw error;
    }
  }

  /**
   * Severity string ni enum ga o'zgartirish
   */
  private convertToSeverity(severity: string): Severity {
    switch (severity?.toLowerCase()) {
      case 'high':
        return Severity.HIGH;
      case 'medium':
        return Severity.MEDIUM;
      case 'low':
        return Severity.LOW;
      default:
        return Severity.LOW;
    }
  }

  /**
   * OpenAI service ishlab turganini tekshirish
   */
  async healthCheck(): Promise<boolean> {
    try {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      return !!apiKey && apiKey !== 'your_openai_api_key_here';
    } catch {
      return false;
    }
  }
}
