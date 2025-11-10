import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT } from '../config/apiConfig';

// API Response Types
export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Auth DTOs
export interface LoginRequest {
  identifier: string; // Can be username or email
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Extended user profile data for additional fields
export interface UserProfileData {
  name?: string;
  age?: string;
  nativeLanguage?: string;
  learningLanguage?: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  token?: string;
  username?: string;
  email?: string;
  role?: string;
  profileImageUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  age: string;
  nativeLanguage: string;
  learningLanguage: string;
  isAdmin: boolean;
  isGuest: boolean;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await this.clearAuthToken();
          // You could trigger a logout action here
        }
        return Promise.reject(error);
      }
    );
  }

  // Token Management
  private getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem('authToken');
  }

  private setAuthToken(token: string): Promise<void> {
    return AsyncStorage.setItem('authToken', token);
  }

  private clearAuthToken(): Promise<void> {
    return AsyncStorage.removeItem('authToken');
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      
      if (response.data.isSuccess && response.data.token) {
        await this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const registerData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      };
      
      const response = await this.api.post<AuthResponse>('/auth/register', registerData);
      
      if (response.data.isSuccess && response.data.token) {
        await this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      // Call backend logout if available
      await this.api.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if backend call fails
      console.warn('Backend logout failed:', error);
    } finally {
      await this.clearAuthToken();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.api.get<ApiResponse<User>>('/auth/me');
      return response.data.data || null;
    } catch (error) {
      console.warn('Failed to get current user:', error);
      return null;
    }
  }

  async checkAdmin(): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.api.get<ApiResponse<boolean>>('/auth/check-admin');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Helper Methods
  private handleError(error: any): Error {
    if (error.response) {
      // Backend responded with error status
      const message = error.response.data?.message || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Generic API Methods for other endpoints
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Upload profile image
  async uploadProfileImage(imageUri: string): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      
      // For React Native, we need to format the file data properly
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('file', {
        uri: imageUri,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      const response = await this.api.post<AuthResponse>(
        '/auth/upload-profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get user profile
  async getUserProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get<ApiResponse<any>>('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Update user profile
  async updateProfile(data: { name?: string; email?: string; age?: string; nativeLanguage?: string; learningLanguage?: string; profileImageUrl?: string }): Promise<AuthResponse> {
    try {
      const response = await this.api.put<AuthResponse>('/auth/update-profile', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;
