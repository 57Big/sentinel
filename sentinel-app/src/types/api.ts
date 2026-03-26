// API Response Types for Sentinel App

// User & Authentication Types
export interface User {
  id: string;
  name?: string;
  username?: string;
  email: string;
  fullName?: string;
  role?: 'admin' | 'moderator' | 'user';
  createdAt: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Toxicity Detection Types
export type ToxicityLevel = 'xavfsiz' | 'shubhali' | 'toksik';

export interface ToxicityAnalysisRequest {
  text: string;
  userId?: string;
}

export interface ToxicityWord {
  word: string;
  position: number;
  severity: 'low' | 'medium' | 'high';
}

export interface ToxicityAnalysisResult {
  id: string;
  originalText: string;
  toxicityLevel: ToxicityLevel;
  toxicityScore: number; // 0-100
  aggressionScore?: number; // 0-100 Agressivlik darajasi
  offenseScore?: number; // 0-100 Haqorat darajasi
  threatScore?: number; // 0-100 Tahdid darajasi
  detectedWords: ToxicityWord[];
  timestamp: string;
  userId?: string;
}

export interface ToxicityAnalysisResponse {
  success: boolean;
  message: string;
  data: ToxicityAnalysisResult;
}

// Moderation Types
export interface ModerationItem {
  id: string;
  content: string;
  toxicityLevel: ToxicityLevel;
  toxicityScore: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface ModerationListResponse {
  success: boolean;
  message: string;
  data: {
    items: ModerationItem[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface ModerationActionRequest {
  itemId: string;
  action: 'approve' | 'reject';
  notes?: string;
}

export interface ModerationActionResponse {
  success: boolean;
  message: string;
  data: ModerationItem;
}

// Results & History Types
export interface ResultItem {
  id: string;
  text: string;
  toxicityLevel: ToxicityLevel;
  toxicityScore: number;
  aggressionScore?: number;
  offenseScore?: number;
  threatScore?: number;
  analyzedAt: string;
  detectedWords: ToxicityWord[];
}

export interface ResultsListResponse {
  success: boolean;
  message: string;
  data: {
    results: ResultItem[];
    total: number;
    page: number;
    pageSize: number;
  };
}

// Admin Panel Types
export interface SystemStats {
  totalUsers: number;
  totalAnalyses: number;
  totalModeration: number;
  averageToxicityScore: number;
  toxicContentPercentage: number;
  analysesGrowthPercentage: number;
  usersGrowthPercentage: number;
}

export interface UserActivity {
  userId: string;
  username: string;
  analysisCount: number;
  lastActive: string;
}

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: {
    stats: SystemStats;
    recentUsers: UserActivity[];
    recentAnalyses: ResultItem[];
  };
}

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
