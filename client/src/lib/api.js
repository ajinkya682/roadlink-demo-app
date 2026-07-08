import axios from 'axios';
import { SecureStorage } from '../hooks/useNative';
import { hapticManager } from '../services/sound/HapticManager';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error("VITE_API_URL is not defined in environment variables.");
}

// Create an Axios instance pointing to the Phase 3 backend
const api = axios.create({
  baseURL: API_URL
});

// Flag to prevent infinite retry loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await SecureStorage.get('roadlink_access_token');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Error getting access token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s and Refresh Token
api.interceptors.response.use(
  (response) => {
    // Trigger success feedback for mutations (only haptics now)
    if (response.config && response.config.method && response.config.method.toLowerCase() !== 'get') {
      hapticManager.vibrateSuccess();
    }
    return response;
  },
  async (error) => {
    // Trigger error feedback for mutations or specific errors
    if (error.config && error.config.method && error.config.method.toLowerCase() !== 'get') {
      hapticManager.vibrateError();
    }
    
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStorage.get('roadlink_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint directly using fetch to avoid interceptor loops
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error('Refresh failed');
        }

        const newAccessToken = data.data.accessToken;
        
        // Save new token
        await SecureStorage.set('roadlink_access_token', newAccessToken);
        window.dispatchEvent(new CustomEvent('auth:token_refreshed', { detail: newAccessToken }));

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Force logout if refresh fails completely
        await SecureStorage.remove('roadlink_access_token');
        await SecureStorage.remove('roadlink_refresh_token');
        await SecureStorage.remove('roadlink_auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
