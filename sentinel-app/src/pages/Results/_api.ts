import apiClient from '@/utils/axios';
import type { ResultsListResponse, PaginationParams } from '@/types/api';

/**
 * Tahlil natijalarini olish
 *
 * REQUEST: (query params)
 * GET /results/list?page=1&pageSize=10&sortBy=analyzedAt&sortOrder=desc
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Natijalar muvaffaqiyatli yuklandi",
 *   "data": {
 *     "results": [
 *       {
 *         "id": "result_uuid",
 *         "text": "Tahlil qilingan matn",
 *         "toxicityLevel": "xavfsiz",
 *         "toxicityScore": 15.5,
 *         "analyzedAt": "2024-01-01T00:00:00.000Z",
 *         "detectedWords": [...]
 *       }
 *     ],
 *     "total": 100,
 *     "page": 1,
 *     "pageSize": 10
 *   }
 * }
 *
 * @param params - Pagination parametrlari
 * @returns Natijalar ro'yxati
 */
export const getResults = async (params: PaginationParams): Promise<ResultsListResponse> => {
  try {
    const response = await apiClient.get<ResultsListResponse>('/results/list', {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Natijalarni yuklashda xatolik');
  }
};

/**
 * Barcha natijalarni olish (faqat admin uchun)
 *
 * REQUEST: (query params)
 * GET /results/all?page=1&pageSize=10&sortBy=analyzedAt&sortOrder=desc
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Barcha natijalar muvaffaqiyatli yuklandi",
 *   "data": {
 *     "results": [
 *       {
 *         "id": "result_uuid",
 *         "text": "Tahlil qilingan matn",
 *         "toxicityLevel": "xavfsiz",
 *         "toxicityScore": 15.5,
 *         "analyzedAt": "2024-01-01T00:00:00.000Z",
 *         "detectedWords": [...]
 *       }
 *     ],
 *     "total": 1500,
 *     "page": 1,
 *     "pageSize": 10
 *   }
 * }
 *
 * @param params - Pagination parametrlari
 * @returns Barcha natijalar ro'yxati (faqat admin)
 */
export const getAllResults = async (params: PaginationParams): Promise<ResultsListResponse> => {
  try {
    const response = await apiClient.get<ResultsListResponse>('/results/all', {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Natijalarni yuklashda xatolik');
  }
};

/**
 * Foydalanuvchining tahlil natijalarini olish
 *
 * REQUEST: (query params)
 * GET /results/user/{userId}?page=1&pageSize=10&sortBy=analyzedAt&sortOrder=desc
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Foydalanuvchi natijalari yuklandi",
 *   "data": {
 *     "results": [
 *       {
 *         "id": "result_uuid",
 *         "text": "Tahlil qilingan matn",
 *         "toxicityLevel": "xavfsiz",
 *         "toxicityScore": 15.5,
 *         "analyzedAt": "2024-01-01T00:00:00.000Z",
 *         "detectedWords": [...]
 *       }
 *     ],
 *     "total": 50,
 *     "page": 1,
 *     "pageSize": 10
 *   }
 * }
 *
 * @param userId - Foydalanuvchi ID
 * @param params - Pagination parametrlari
 * @returns Foydalanuvchi natijalari
 */
export const getUserResults = async (
  userId: string,
  params: PaginationParams
): Promise<ResultsListResponse> => {
  try {
    const response = await apiClient.get<ResultsListResponse>(`/results/user/${userId}`, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Foydalanuvchi natijalarini yuklashda xatolik');
  }
};

/**
 * Natijani eksport qilish (PDF, CSV)
 *
 * REQUEST:
 * POST /results/export/{resultId}
 * {
 *   "format": "pdf" | "csv"
 * }
 *
 * RESPONSE:
 * {
 *   "data": {
 *     "url": "https://example.com/downloads/result_export.pdf"
 *   }
 * }
 *
 * @param resultId - Natija ID
 * @param format - Eksport formati
 * @returns Fayl URL
 */
export const exportResult = async (
  resultId: string,
  format: 'pdf' | 'csv'
): Promise<string> => {
  try {
    const response = await apiClient.post<{ data: { url: string } }>(
      `/results/export/${resultId}`,
      { format }
    );
    return response.data.data.url;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Eksport qilishda xatolik');
  }
};

/**
 * Natijalarni filter qilish
 *
 * REQUEST:
 * POST /results/filter
 * {
 *   "toxicityLevel": "xavfsiz" | "shubhali" | "toksik" (optional),
 *   "dateFrom": "2024-01-01" (optional),
 *   "dateTo": "2024-12-31" (optional),
 *   "minScore": 0 (optional),
 *   "maxScore": 100 (optional),
 *   "page": 1,
 *   "pageSize": 10
 * }
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Natijalar filterlandi",
 *   "data": {
 *     "results": [
 *       {
 *         "id": "result_uuid",
 *         "text": "Tahlil qilingan matn",
 *         "toxicityLevel": "xavfsiz",
 *         "toxicityScore": 15.5,
 *         "analyzedAt": "2024-01-01T00:00:00.000Z",
 *         "detectedWords": [...]
 *       }
 *     ],
 *     "total": 25,
 *     "page": 1,
 *     "pageSize": 10
 *   }
 * }
 *
 * @param filters - Filter parametrlari
 * @returns Filterlangan natijalar
 */
export const filterResults = async (filters: {
  toxicityLevel?: string;
  dateFrom?: string;
  dateTo?: string;
  minScore?: number;
  maxScore?: number;
  page: number;
  pageSize: number;
}): Promise<ResultsListResponse> => {
  try {
    const response = await apiClient.post<ResultsListResponse>('/results/filter', filters);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Filterlashda xatolik');
  }
};
