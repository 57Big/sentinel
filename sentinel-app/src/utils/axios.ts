import axios from 'axios';

// Base API URL - ushbu qiymatni .env faylidan olish mumkin
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Axios instance yaratish
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - har bir so'rovga token qo'shish
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xatolarni boshqarish
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('Axios interceptor error:', error.response?.status);
    if (error.response?.status === 401) {
      // Token muddati tugagan yoki yaroqsiz
      console.log('401 error - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Bu faqat 401 xato bo'lganda ishga tushadi, login request uchun emas
      if (!error.config.url?.includes('/auth/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
