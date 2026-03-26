import apiClient from '@/utils/axios';
import type { AdminDashboardResponse, User } from '@/types/api';

/**
 * Admin dashboard ma'lumotlarini olish
 *
 * REQUEST:
 * GET /admin/dashboard
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Dashboard ma'lumotlari yuklandi",
 *   "data": {
 *     "stats": {
 *       "totalUsers": 1500,
 *       "totalAnalyses": 5000,
 *       "totalModeration": 250,
 *       "averageToxicityScore": 35.5,
 *       "toxicContentPercentage": 12.5
 *     },
 *     "recentUsers": [
 *       {
 *         "userId": "user_uuid",
 *         "username": "shamshod",
 *         "analysisCount": 25,
 *         "lastActive": "2024-01-01T00:00:00.000Z"
 *       }
 *     ],
 *     "recentAnalyses": [...]
 *   }
 * }
 *
 * @returns Dashboard statistikasi
 */
export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  try {
    const response = await apiClient.get<AdminDashboardResponse>('/admin/dashboard');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Dashboard ma\'lumotlarini yuklashda xatolik');
  }
};

/**
 * Barcha foydalanuvchilar ro'yxatini olish
 *
 * REQUEST: (query params)
 * GET /admin/users?page=1&pageSize=10&search=shamshod&role=user
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Foydalanuvchilar yuklandi",
 *   "data": {
 *     "users": [
 *       {
 *         "id": "user_uuid",
 *         "name": "Shamshod",
 *         "email": "shamshod@example.com",
 *         "role": "user" | "moderator" | "admin",
 *         "createdAt": "2024-01-01T00:00:00.000Z"
 *       }
 *     ],
 *     "total": 100,
 *     "page": 1,
 *     "pageSize": 10
 *   }
 * }
 *
 * @param params - Pagination parametrlari
 * @returns Foydalanuvchilar ro'yxati
 */
export const getAllUsers = async (params: {
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
}) => {
  try {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Foydalanuvchilarni yuklashda xatolik');
  }
};

/**
 * Foydalanuvchi rolini o'zgartirish
 *
 * REQUEST:
 * PATCH /admin/users/{userId}/role
 * {
 *   "role": "admin" | "moderator" | "user"
 * }
 *
 * RESPONSE:
 * {
 *   "data": {
 *     "id": "user_uuid",
 *     "name": "Shamshod",
 *     "email": "shamshod@example.com",
 *     "role": "moderator",
 *     "createdAt": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 *
 * @param userId - Foydalanuvchi ID
 * @param role - Yangi rol
 */
export const updateUserRole = async (
  userId: string,
  role: 'admin' | 'moderator' | 'user'
): Promise<User> => {
  try {
    const response = await apiClient.patch<{ data: User }>(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Rolni o\'zgartirishda xatolik');
  }
};

/**
 * Foydalanuvchini bloklash/blokdan chiqarish
 *
 * REQUEST:
 * PATCH /admin/users/{userId}/block
 * {
 *   "blocked": true | false
 * }
 *
 * RESPONSE:
 * {
 *   "data": {
 *     "id": "user_uuid",
 *     "name": "Shamshod",
 *     "email": "shamshod@example.com",
 *     "role": "user",
 *     "blocked": true,
 *     "createdAt": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 *
 * @param userId - Foydalanuvchi ID
 * @param blocked - Bloklash holati
 */
export const toggleUserBlock = async (userId: string, blocked: boolean): Promise<User> => {
  try {
    const response = await apiClient.patch<{ data: User }>(`/admin/users/${userId}/block`, {
      blocked,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Foydalanuvchi holatini o\'zgartirishda xatolik');
  }
};

/**
 * Foydalanuvchini o'chirish
 *
 * REQUEST:
 * DELETE /admin/users/{userId}
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Foydalanuvchi o'chirildi"
 * }
 *
 * @param userId - Foydalanuvchi ID
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/users/${userId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Foydalanuvchini o\'chirishda xatolik');
  }
};

/**
 * Tizim sozlamalarini olish
 *
 * REQUEST:
 * GET /admin/settings
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Sozlamalar yuklandi",
 *   "data": {
 *     "toxicityThreshold": 70,
 *     "autoModeration": true,
 *     "emailNotifications": false,
 *     "maxAnalysisPerDay": 100
 *   }
 * }
 */
export const getSystemSettings = async () => {
  try {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sozlamalarni yuklashda xatolik');
  }
};

/**
 * Tizim sozlamalarini yangilash
 *
 * REQUEST:
 * PUT /admin/settings
 * {
 *   "toxicityThreshold": 70,
 *   "autoModeration": true,
 *   "emailNotifications": false,
 *   "maxAnalysisPerDay": 100
 * }
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Sozlamalar saqlandi",
 *   "data": {
 *     "toxicityThreshold": 70,
 *     "autoModeration": true,
 *     "emailNotifications": false,
 *     "maxAnalysisPerDay": 100
 *   }
 * }
 *
 * @param settings - Yangilangan sozlamalar
 */
export const updateSystemSettings = async (settings: any) => {
  try {
    const response = await apiClient.put('/admin/settings', settings);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sozlamalarni saqlashda xatolik');
  }
};

/**
 * Statistika (7 yoki 30 kun)
 *
 * REQUEST:
 * GET /admin/weekly-statistics?days=7
 * GET /admin/weekly-statistics?days=30
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Statistika yuklandi",
 *   "data": [
 *     {
 *       "day": "Dush" | "1/12",
 *       "count": 25,
 *       "date": "2024-01-01T00:00:00.000Z"
 *     }
 *   ]
 * }
 *
 * @param days - Necha kunlik statistika (7 yoki 30)
 */
export const getWeeklyStatistics = async (days: number = 7) => {
  try {
    const response = await apiClient.get(`/admin/weekly-statistics?days=${days}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Statistikani yuklashda xatolik');
  }
};

/**
 * So'nggi xavfli matnlar
 *
 * REQUEST:
 * GET /admin/recent-dangerous?limit=10
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "So'nggi xavfli matnlar yuklandi",
 *   "data": [
 *     {
 *       "id": "analysis_id",
 *       "text": "Xavfli matn",
 *       "severity": "Juda xavfli" | "Tahdid" | "Haqorat",
 *       "toxicityScore": 85,
 *       "time": "2 daqiqa avval",
 *       "createdAt": "2024-01-01T00:00:00.000Z",
 *       "user": {
 *         "id": "user_id",
 *         "name": "Shamshod",
 *         "email": "shamshod@example.com"
 *       }
 *     }
 *   ]
 * }
 *
 * @param limit - Nechta natija qaytarish kerak (default: 10)
 */
export const getRecentDangerousContent = async (limit: number = 10) => {
  try {
    const response = await apiClient.get(`/admin/recent-dangerous?limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "So'nggi xavfli matnlarni yuklashda xatolik");
  }
};
