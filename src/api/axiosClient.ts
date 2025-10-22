import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../services/authService';
import { AuthResponse } from '../types/auth';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7123';

// This is the internal, powerful client.
const axiosClient = axios.create({
    baseURL: BASE_URL,
});

// Request Interceptor: Adds the auth token to every request.
axiosClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Token Refresh Logic ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor: Handles token refresh on 401 errors.
axiosClient.interceptors.response.use(
    (response) => {
        // We return the full response so the facade can handle it.
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosClient(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // Use a direct axios.post here to avoid circular interceptor calls
                const refreshResponse = await axios.post<AuthResponse>(`${BASE_URL}/api/auth/refresh`, { refreshToken });
                const { token: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
                
                saveTokens({ isSuccess: true, message: '', token: newAccessToken, refreshToken: newRefreshToken });
                
                axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                
                processQueue(null, newAccessToken);
                return axiosClient(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;