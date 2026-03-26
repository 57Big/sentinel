import apiClient from '@/utils/axios';
import type { LoginRequest, LoginResponse } from '@/types/api';

/**
 * Foydalanuvchini tizimga kiritish
 *
 * REQUEST:
 * {
 *   "email": "shamshod@example.com",
 *   "password": "password123"
 * }
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Login muvaffaqiyatli",
 *   "user": {
 *     "id": "uuid",
 *     "name": "Shamshod",
 *     "email": "shamshod@example.com",
 *     "role": "user",
 *     "createdAt": "2024-01-01T00:00:00.000Z"
 *   },
 *   "token": "jwt_token_string",
 *   "refreshToken": "refresh_token_string" (optional)
 * }
 *
 * @param credentials - Email va parol
 * @returns Login response with user data and token
 */
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

    console.log('API response:', response.data);

    // Tokenni saqlash - Backend to'g'ridan-to'g'ri token va user qaytaradi
    if (response.data.success && response.data.token) {
      console.log('Saving token and user to localStorage');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: any) {
    console.error('Login API error:', error);
    throw new Error(error.response?.data?.message || 'Login muvaffaqiyatsiz');
  }
};

/**
 * Foydalanuvchini tizimdan chiqarish
 *
 * REQUEST: (body yo'q)
 * POST /auth/logout
 *
 * RESPONSE:
 * {
 *   "success": true,
 *   "message": "Logout muvaffaqiyatli"
 * }
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Tokenni yangilash
 *
 * REQUEST:
 * {
 *   "refreshToken": "refresh_token_string"
 * }
 *
 * RESPONSE:
 * {
 *   "data": {
 *     "token": "new_jwt_token_string"
 *   }
 * }
 *
 * @param refreshToken - Refresh token
 * @returns Yangilangan token
 */
export const refreshToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await apiClient.post<{ data: { token: string } }>('/auth/refresh', {
      refreshToken,
    });

    const newToken = response.data.data.token;
    localStorage.setItem('token', newToken);

    return newToken;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Token yangilash muvaffaqiyatsiz');
  }
};
