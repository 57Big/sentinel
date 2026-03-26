import {
  ToxicityLevel,
  DetectedWord,
} from '../../analysis/schemas/analysis.schema';

export interface ResultItem {
  id: string;
  text: string;
  toxicityLevel: ToxicityLevel;
  toxicityScore: number;
  aggressionScore?: number;
  offenseScore?: number;
  threatScore?: number;
  analyzedAt: Date;
  detectedWords: DetectedWord[];
}

export interface PaginatedResultsResponse {
  results: ResultItem[];
  total: number;
  page: number;
  pageSize: number;
}
