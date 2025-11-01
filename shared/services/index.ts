import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// API Client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: any) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
          break;
        case 403:
          toast.error('Akses Ditolak', {
            description: 'Anda tidak memiliki izin untuk melakukan aksi ini.',
          });
          break;
        case 404:
          toast.error('Tidak Ditemukan', {
            description: 'Resource yang diminta tidak ditemukan.',
          });
          break;
        case 422:
          // Validation errors
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat().join(', ');
            toast.error('Validasi Gagal', {
              description: errorMessages,
            });
          }
          break;
        case 500:
          toast.error('Server Error', {
            description: 'Terjadi kesalahan pada server. Silakan coba lagi.',
          });
          break;
        default:
          toast.error('Error', {
            description: data.message || 'Terjadi kesalahan yang tidak diketahui.',
          });
      }
    } else if (error.request) {
      toast.error('Network Error', {
        description: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      });
    }
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }

  // File upload method
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export types
export type { AxiosResponse, AxiosRequestConfig };

// Auth service
export class AuthService {
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
  }

  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  async refreshToken() {
    const response = await apiClient.post('/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }
}

export const authService = new AuthService();