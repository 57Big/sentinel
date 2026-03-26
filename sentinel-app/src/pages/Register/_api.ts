import apiClient from '@/utils/axios';
import type { RegisterRequest, RegisterResponse } from '@/types/api';

/**
 * Yangi foydalanuvchi ro'yxatdan o'tkazish
 *
 * REQUEST:
 * {
 *   "name": "Shamshod",
 *   "email": "shamshod@example.com",
 *   "password": "password123"
 * }
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Ro'yxatdan o'tish muvaffaqiyatli",
 *   "data": {
 *     "user": {
 *       "id": "uuid",
 *       "name": "Shamshod",
 *       "email": "shamshod@example.com",
 *       "role": "user",
 *       "createdAt": "2024-01-01T00:00:00.000Z"
 *     },
 *     "token": "jwt_token_string"
 *   }
 * }
 *
 * @param userData - Foydalanuvchi ma'lumotlari
 * @returns Register response with user data and token
 */
export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData);

    // Tokenni saqlash
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Ro\'yxatdan o\'tish muvaffaqiyatsiz');
  }
};

/**
 * Emailni tekshirish (mavjudligini)
 *
 * REQUEST:
 * {
 *   "email": "shamshod@example.com"
 * }
 *
 * RESPONSE:
 * {
 *   "data": {
 *     "available": true
 *   }
 * }
 *
 * @param email - Email manzil
 * @returns Email mavjud yoki yo'qligi (true = bo'sh, false = band)
 */
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<{ data: { available: boolean } }>(
      '/auth/check-email',
      { email }
    );
    return response.data.data.available;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Email tekshirishda xatolik');
  }
};

/**
 * Username tekshirish (mavjudligini)
 *
 * REQUEST:
 * {
 *   "username": "shamshod123"
 * }
 *
 * RESPONSE:
 * {
 *   "data": {
 *     "available": true
 *   }
 * }
 *
 * @param username - Foydalanuvchi nomi
 * @returns Username mavjud yoki yo'qligi (true = bo'sh, false = band)
 */
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<{ data: { available: boolean } }>(
      '/auth/check-username',
      { username }
    );
    return response.data.data.available;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Username tekshirishda xatolik');
  }
};
