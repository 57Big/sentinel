import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Analysis,
  AnalysisDocument,
} from '../analysis/schemas/analysis.schema';
import { QueryResultsDto } from './dto/query-results.dto';
import {
  PaginatedResultsResponse,
  ResultItem,
} from './interfaces/results-response.interface';

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);

  constructor(
    @InjectModel(Analysis.name) private analysisModel: Model<AnalysisDocument>,
  ) {}

  /**
   * Barcha tahlil natijalarini olish (pagination bilan)
   */
  async getAllResults(
    queryDto: QueryResultsDto,
  ): Promise<PaginatedResultsResponse> {
    const { page, pageSize, sortBy, sortOrder } = queryDto;

    const skip = (page - 1) * pageSize;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    // Frontend'dan analyzedAt kelsa, database'dagi createdAt ga map qilish
    const dbSortField = sortBy === 'analyzedAt' ? 'createdAt' : sortBy;

    this.logger.log(
      `Fetching all results: page=${page}, pageSize=${pageSize}, sortBy=${sortBy} (db: ${dbSortField}), sortOrder=${sortOrder}, skip=${skip}`,
    );

    const [results, total] = await Promise.all([
      this.analysisModel
        .find()
        .sort({ [dbSortField]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.analysisModel.countDocuments(),
    ]);

    this.logger.log(`Found ${results.length} results out of ${total} total`);

    return {
      results: results.map((item) => this.formatResultItem(item)),
      total,
      page,
      pageSize,
    };
  }

  /**
   * Foydalanuvchining natijalarini olish
   */
  async getUserResults(
    userId: string,
    queryDto: QueryResultsDto,
  ): Promise<PaginatedResultsResponse> {
    const { page, pageSize, sortBy, sortOrder } = queryDto;

    const skip = (page - 1) * pageSize;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    // Frontend'dan analyzedAt kelsa, database'dagi createdAt ga map qilish
    const dbSortField = sortBy === 'analyzedAt' ? 'createdAt' : sortBy;

    this.logger.log(
      `Fetching user results for userId=${userId}: page=${page}, pageSize=${pageSize}, sortBy=${sortBy} (db: ${dbSortField}), skip=${skip}`,
    );

    const [results, total] = await Promise.all([
      this.analysisModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ [dbSortField]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.analysisModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return {
      results: results.map((item) => this.formatResultItem(item)),
      total,
      page,
      pageSize,
    };
  }

  /**
   * Analysis dokumentini ResultItem formatiga o'zgartirish
   */
  private formatResultItem(analysis: AnalysisDocument): ResultItem {
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
