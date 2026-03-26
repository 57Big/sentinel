import apiClient from '@/utils/axios';
import type {
  ModerationListResponse,
  ModerationActionRequest,
  ModerationActionResponse,
  PaginationParams,
} from '@/types/api';

/**
 * Moderatsiya qilish uchun elementlar ro'yxatini olish
 *
 * REQUEST: (query params)
 * GET /moderation/list?page=1&pageSize=10&status=pending&sortBy=submittedAt&sortOrder=desc
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Moderatsiya ro'yxati yuklandi",
 *   "data": {
 *     "items": [
 *       {
 *         "id": "moderation_uuid",
 *         "content": "Moderatsiya qilinadigan matn",
 *         "toxicityLevel": "shubhali",
 *         "toxicityScore": 65.5,
 *         "status": "pending" | "approved" | "rejected",
 *         "submittedBy": "user_uuid",
 *         "submittedAt": "2024-01-01T00:00:00.000Z",
 *         "reviewedBy": "moderator_uuid" (optional),
 *         "reviewedAt": "2024-01-02T00:00:00.000Z" (optional),
 *         "reviewNotes": "Izoh" (optional)
 *       }
 *     ],
 *     "total": 50,
 *     "page": 1,
 *     "pageSize": 10
 *   }
 * }
 *
 * @param params - Pagination va filter parametrlari
 * @returns Moderatsiya ro'yxati
 */
export const getModerationList = async (
  params: PaginationParams & { status?: 'pending' | 'approved' | 'rejected' }
): Promise<ModerationListResponse> => {
  try {
    const response = await apiClient.get<ModerationListResponse>('/moderation/list', {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Ro\'yxatni yuklashda xatolik');
  }
};

/**
 * Moderatsiya elementini tasdiqlash yoki rad etish
 *
 * REQUEST:
 * POST /moderation/action
 * {
 *   "itemId": "moderation_uuid",
 *   "action": "approve" | "reject",
 *   "notes": "Moderator izohi" (optional)
 * }
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Moderatsiya muvaffaqiyatli",
 *   "data": {
 *     "id": "moderation_uuid",
 *     "content": "Moderatsiya qilingan matn",
 *     "toxicityLevel": "shubhali",
 *     "toxicityScore": 65.5,
 *     "status": "approved" | "rejected",
 *     "submittedBy": "user_uuid",
 *     "submittedAt": "2024-01-01T00:00:00.000Z",
 *     "reviewedBy": "moderator_uuid",
 *     "reviewedAt": "2024-01-02T00:00:00.000Z",
 *     "reviewNotes": "Izoh"
 *   }
 * }
 *
 * @param actionData - Moderatsiya harakati
 * @returns Yangilangan moderatsiya elementi
 */
export const moderateItem = async (
  actionData: ModerationActionRequest
): Promise<ModerationActionResponse> => {
  try {
    const response = await apiClient.post<ModerationActionResponse>(
      '/moderation/action',
      actionData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Moderatsiya qilishda xatolik');
  }
};

/**
 * Moderatsiya statistikasini olish
 *
 * REQUEST:
 * GET /moderation/stats
 *
 * RESPONSE:
 * {
 *   "data": {
 *     "pending": 25,
 *     "approved": 150,
 *     "rejected": 30,
 *     "total": 205
 *   }
 * }
 *
 * @returns Moderatsiya statistikasi
 */
export const getModerationStats = async (): Promise<{
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}> => {
  try {
    const response = await apiClient.get<{
      data: {
        pending: number;
        approved: number;
        rejected: number;
        total: number;
      };
    }>('/moderation/stats');
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Statistikani yuklashda xatolik');
  }
};

/**
 * Moderatsiya elementini ID bo'yicha olish
 *
 * REQUEST:
 * GET /moderation/item/{itemId}
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Element topildi",
 *   "data": {
 *     "id": "moderation_uuid",
 *     "content": "Moderatsiya qilinadigan matn",
 *     "toxicityLevel": "shubhali",
 *     "toxicityScore": 65.5,
 *     "status": "pending",
 *     "submittedBy": "user_uuid",
 *     "submittedAt": "2024-01-01T00:00:00.000Z",
 *     "reviewedBy": "moderator_uuid" (optional),
 *     "reviewedAt": "2024-01-02T00:00:00.000Z" (optional),
 *     "reviewNotes": "Izoh" (optional)
 *   }
 * }
 *
 * @param itemId - Element ID
 * @returns Moderatsiya elementi
 */
export const getModerationItemById = async (itemId: string) => {
  try {
    const response = await apiClient.get(`/moderation/item/${itemId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Elementni yuklashda xatolik');
  }
};

/**
 * Moderatsiya elementini o'chirish
 *
 * REQUEST:
 * DELETE /moderation/{itemId}
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Element o'chirildi"
 * }
 *
 * @param itemId - Element ID
 * @returns Success message
 */
export const deleteModerationItem = async (itemId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/moderation/${itemId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Elementni o'chirishda xatolik");
  }
};
