/**
 * API Client for Cadence Backend
 * 
 * This module creates a configured Axios instance that:
 * - Attaches bearer tokens to requests automatically
 * - Handles 401 responses with silent token refresh
 * - Maps API error codes to user-friendly messages
 * - Supports switching between mock and real backend via VITE_USE_MOCK
 * 
 * BACKEND INTEGRATION:
 * 1. Set VITE_USE_MOCK=false in .env
 * 2. Set VITE_API_URL to your backend URL (e.g., http://localhost:5000/api/v1)
 * 3. The API client will automatically route all requests to the backend
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies (refresh token) with requests
  timeout: 15000,
});

// In-memory token storage (never in localStorage per FE-ST-05)
let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

/**
 * Set the access token in memory
 * Called after login/register/refresh
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Get the current access token
 */
export const getAccessToken = () => accessToken;

/**
 * Clear the access token (on logout)
 */
export const clearAccessToken = () => {
  accessToken = null;
};

/**
 * Process the queue of failed requests after token refresh
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt silent refresh (FE-AUTH-07)
        const response = await apiClient.post('/auth/refresh');
        const newToken = response.data.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        // Dispatch a custom event so the app can redirect to login
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Map API error codes to user-friendly messages
 * These match the error codes defined in SRS Section 7.7
 */
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHENTICATED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  DUPLICATE_CHECKIN: 'You\'ve already checked in for this habit today.',
  EMAIL_TAKEN: 'This email is already registered. Try logging in instead.',
  DATE_OUT_OF_RANGE: 'Check-in date must be within the last 7 days.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
};

/**
 * Extract a user-friendly error message from an API error response
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.error) {
    const apiError = error.response.data.error;
    return ERROR_MESSAGES[apiError.code] || apiError.message || 'An unexpected error occurred.';
  }
  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your connection.';
  }
  return 'An unexpected error occurred. Please try again.';
};

export default apiClient;
