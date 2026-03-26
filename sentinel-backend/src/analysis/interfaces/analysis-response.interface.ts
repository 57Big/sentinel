import { ToxicityLevel, DetectedWord } from '../schemas/analysis.schema';

export interface AnalysisResponse {
  id: string;
  originalText: string;
  toxicityLevel: ToxicityLevel;
  toxicityScore: number;
  aggressionScore?: number;
  offenseScore?: number;
  threatScore?: number;
  detectedWords: DetectedWord[];
  timestamp: Date;
  userId?: string;
}

export interface AnalysisListItem {
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

export interface PaginatedAnalysisResponse {
  results: AnalysisListItem[];
  total: number;
  page: number;
  pageSize: number;
}
