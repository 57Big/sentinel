/**
 * =============================================================================
 * SENTINELLA - TOXICITY ANALYSIS API
 * =============================================================================
 *
 * Bu fayl Check sahifasi uchun zarur bo'lgan barcha API funksiyalarini o'z ichiga oladi.
 *
 * BASE URL: http://localhost:5001/api (yoki VITE_API_BASE_URL)
 *
 * AUTENTIFIKATSIYA:
 * - Token localStorage da 'token' kaliti bilan saqlanadi
 * - Har bir so'rovga avtomatik ravishda Authorization header qo'shiladi
 * - axios.ts dagi interceptor orqali amalga oshiriladi
 *
 * COMMON RESPONSE STRUCTURE:
 * {
 *   "success": boolean,
 *   "message": string,
 *   "data": object (optional),
 *   "error": string (optional)
 * }
 *
 * ERROR HANDLING:
 * - Barcha xatolar try-catch bloki ichida tutiladi
 * - Xato xabarlari response.data.message dan olinadi
 * - Agar message bo'lmasa, default xato xabari qaytariladi
 *
 * =============================================================================
 */

import apiClient from '@/utils/axios';
import type {
  ToxicityAnalysisRequest,
  ToxicityAnalysisResponse,
  ResultsListResponse,
  PaginationParams
} from '@/types/api';

/**
 * Matnni toksiklik uchun tahlil qilish
 *
 * ENDPOINT: POST /api/analysis/check
 *
 * REQUEST HEADERS:
 * {
 *   "Content-Type": "application/json",
 *   "Authorization": "Bearer <token>" (required - faqat login qilgan foydalanuvchilar uchun)
 * }
 *
 * REQUEST BODY:
 * {
 *   "text": "Tahlil qilinadigan matn"
 * }
 *
 * MISOL REQUEST:
 * {
 *   "text": "Bu juda yaxshi fikr ekan!"
 * }
 *
 * ESLATMA: userId avtomatik ravishda JWT tokendan olinadi
 *
 * RESPONSE (Success - 200 OK):
 * {
 *   "success": true,
 *   "message": "Tahlil muvaffaqiyatli bajarildi",
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "originalText": "Bu juda yaxshi fikr ekan!",
 *     "toxicityLevel": "xavfsiz",
 *     "toxicityScore": 5.2,
 *     "detectedWords": [],
 *     "timestamp": "2024-03-26T10:30:00.000Z",
 *     "userId": "user-uuid-123"
 *   }
 * }
 *
 * RESPONSE (Error - 400 Bad Request):
 * {
 *   "success": false,
 *   "message": "Matn kiritilishi shart",
 *   "error": "INVALID_INPUT"
 * }
 *
 * RESPONSE (Error - 500 Internal Server Error):
 * {
 *   "success": false,
 *   "message": "Server xatosi yuz berdi",
 *   "error": "INTERNAL_ERROR"
 * }
 *
 * @param analysisData - Tahlil qilinadigan matn
 * @returns Tahlil natijalari
 */
export const analyzeText = async (
  analysisData: ToxicityAnalysisRequest
): Promise<ToxicityAnalysisResponse> => {
  try {
    // Token interceptor orqali avtomatik yuboriladi
    // Backend JWT dan userId ni oladi
    const response = await apiClient.post<ToxicityAnalysisResponse>(
      '/analysis/check',
      analysisData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Tahlil qilishda xatolik yuz berdi');
  }
};

/**
 * Foydalanuvchining tahlil tarixini olish
 *
 * ENDPOINT: GET /api/analysis/history
 *
 * REQUEST HEADERS:
 * {
 *   "Authorization": "Bearer <token>" (required - faqat tizimga kirgan foydalanuvchilar uchun)
 * }
 *
 * QUERY PARAMETERS:
 * - page: number (default: 1) - Sahifa raqami
 * - pageSize: number (default: 10, max: 100) - Har bir sahifadagi elementlar soni
 * - sortBy: string (default: "analyzedAt") - Qaysi maydon bo'yicha saralash
 * - sortOrder: "asc" | "desc" (default: "desc") - Saralash tartibi
 *
 * MISOL REQUEST:
 * GET /api/analysis/history?page=1&pageSize=3&sortBy=analyzedAt&sortOrder=desc
 *
 * RESPONSE (Success - 200 OK):
 * {
 *   "success": true,
 *   "message": "Tarix muvaffaqiyatli yuklandi",
 *   "data": {
 *     "results": [
 *       {
 *         "id": "550e8400-e29b-41d4-a716-446655440001",
 *         "text": "Bu juda yaxshi fikr ekan!",
 *         "toxicityLevel": "xavfsiz",
 *         "toxicityScore": 5.2,
 *         "analyzedAt": "2024-03-26T10:30:00.000Z",
 *         "detectedWords": []
 *       },
 *       {
 *         "id": "550e8400-e29b-41d4-a716-446655440002",
 *         "text": "Nega har doim shunday qilasanlar?",
 *         "toxicityLevel": "shubhali",
 *         "toxicityScore": 52.8,
 *         "analyzedAt": "2024-03-25T15:20:00.000Z",
 *         "detectedWords": [
 *           {
 *             "word": "nega",
 *             "position": 0,
 *             "severity": "low"
 *           }
 *         ]
 *       },
 *       {
 *         "id": "550e8400-e29b-41d4-a716-446655440003",
 *         "text": "Bu juda yomon fikr va sen buni hech qachon tushunmaysan!",
 *         "toxicityLevel": "toksik",
 *         "toxicityScore": 88.5,
 *         "analyzedAt": "2024-03-24T08:15:00.000Z",
 *         "detectedWords": [
 *           {
 *             "word": "yomon",
 *             "position": 8,
 *             "severity": "medium"
 *           },
 *           {
 *             "word": "hech qachon",
 *             "position": 35,
 *             "severity": "high"
 *           }
 *         ]
 *       }
 *     ],
 *     "total": 150,
 *     "page": 1,
 *     "pageSize": 3
 *   }
 * }
 *
 * RESPONSE (Error - 401 Unauthorized):
 * {
 *   "success": false,
 *   "message": "Autentifikatsiya talab qilinadi",
 *   "error": "UNAUTHORIZED"
 * }
 *
 * RESPONSE (Error - 404 Not Found):
 * {
 *   "success": false,
 *   "message": "Tarix topilmadi",
 *   "error": "NOT_FOUND"
 * }
 *
 * @param params - Pagination parametrlari
 * @returns Tahlil tarixi ro'yxati
 */
export const getUserAnalysisHistory = async (
  params: PaginationParams
): Promise<ResultsListResponse> => {
  try {
    // Token interceptor orqali avtomatik yuboriladi
    // Backend JWT dan userId ni oladi
    const response = await apiClient.get<ResultsListResponse>('/analysis/history', {
      params: params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Tarixni yuklashda xatolik');
  }
};

/**
 * Tahlil natijasini ID bo'yicha olish
 *
 * ENDPOINT: GET /api/analysis/{analysisId}
 *
 * REQUEST HEADERS:
 * {
 *   "Authorization": "Bearer <token>" (optional - agar foydalanuvchi tizimga kirgan bo'lsa)
 * }
 *
 * URL PARAMETERS:
 * - analysisId: string (required) - Tahlil ID (UUID format)
 *
 * MISOL REQUEST:
 * GET /api/analysis/550e8400-e29b-41d4-a716-446655440000
 *
 * RESPONSE (Success - 200 OK):
 * {
 *   "success": true,
 *   "message": "Tahlil muvaffaqiyatli topildi",
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "originalText": "Bu juda yomon fikr va sen buni hech qachon tushunmaysan!",
 *     "toxicityLevel": "toksik",
 *     "toxicityScore": 88.5,
 *     "detectedWords": [
 *       {
 *         "word": "yomon",
 *         "position": 8,
 *         "severity": "medium"
 *       },
 *       {
 *         "word": "hech qachon",
 *         "position": 35,
 *         "severity": "high"
 *       }
 *     ],
 *     "timestamp": "2024-03-26T10:30:00.000Z",
 *     "userId": "user-uuid-123"
 *   }
 * }
 *
 * RESPONSE (Error - 404 Not Found):
 * {
 *   "success": false,
 *   "message": "Tahlil topilmadi",
 *   "error": "NOT_FOUND"
 * }
 *
 * RESPONSE (Error - 400 Bad Request):
 * {
 *   "success": false,
 *   "message": "Noto'g'ri ID formati",
 *   "error": "INVALID_ID"
 * }
 *
 * @param analysisId - Tahlil ID
 * @returns Tahlil natijalari
 */
export const getAnalysisById = async (analysisId: string): Promise<ToxicityAnalysisResponse> => {
  try {
    const response = await apiClient.get<ToxicityAnalysisResponse>(
      `/analysis/${analysisId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Tahlilni yuklashda xatolik');
  }
};

/**
 * Tahlil natijasini o'chirish
 *
 * ENDPOINT: DELETE /api/analysis/{analysisId}
 *
 * REQUEST HEADERS:
 * {
 *   "Authorization": "Bearer <token>" (required - faqat o'z tahlillarini o'chirish mumkin)
 * }
 *
 * URL PARAMETERS:
 * - analysisId: string (required) - O'chiriladigan tahlil ID (UUID format)
 *
 * MISOL REQUEST:
 * DELETE /api/analysis/550e8400-e29b-41d4-a716-446655440000
 *
 * RESPONSE (Success - 200 OK):
 * {
 *   "success": true,
 *   "message": "Tahlil muvaffaqiyatli o'chirildi"
 * }
 *
 * RESPONSE (Error - 401 Unauthorized):
 * {
 *   "success": false,
 *   "message": "Autentifikatsiya talab qilinadi",
 *   "error": "UNAUTHORIZED"
 * }
 *
 * RESPONSE (Error - 403 Forbidden):
 * {
 *   "success": false,
 *   "message": "Sizda bu tahlilni o'chirish huquqi yo'q",
 *   "error": "FORBIDDEN"
 * }
 *
 * RESPONSE (Error - 404 Not Found):
 * {
 *   "success": false,
 *   "message": "Tahlil topilmadi",
 *   "error": "NOT_FOUND"
 * }
 *
 * @param analysisId - Tahlil ID
 */
export const deleteAnalysis = async (analysisId: string): Promise<void> => {
  try {
    await apiClient.delete(`/analysis/${analysisId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'O\'chirishda xatolik');
  }
};
