/**
 * Auth Service
 * Maps to: POST /auth/register, POST /auth/login, POST /auth/refresh,
 *          POST /auth/logout, POST /auth/forgot-password, POST /auth/reset-password,
 *          GET /users/me, PATCH /users/me, PATCH /users/me/password, DELETE /users/me
 * 
 * BACKEND INTEGRATION: All methods call the real API when VITE_USE_MOCK=false.
 * The mock layer is in services/mock/ and is only used for frontend development.
 */

import apiClient, { setAccessToken, clearAccessToken } from './api';
import { mockAuthService } from './mock/mockAuth';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const authService = {
  /** POST /auth/register - body: { name, email, password, timezone } */
  register: async (data) => {
    if (USE_MOCK) return mockAuthService.register(data);
    const res = await apiClient.post('/auth/register', data);
    setAccessToken(res.data.data.accessToken);
    return res.data;
  },

  /** POST /auth/login - body: { email, password } */
  login: async (credentials) => {
    if (USE_MOCK) return mockAuthService.login(credentials);
    const res = await apiClient.post('/auth/login', credentials);
    setAccessToken(res.data.data.accessToken);
    return res.data;
  },

  /** POST /auth/logout */
  logout: async () => {
    if (USE_MOCK) return mockAuthService.logout();
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearAccessToken();
    }
  },

  /** POST /auth/refresh */
  refresh: async () => {
    if (USE_MOCK) return mockAuthService.refresh();
    const res = await apiClient.post('/auth/refresh');
    setAccessToken(res.data.data.accessToken);
    return res.data;
  },

  /** POST /auth/forgot-password - body: { email } */
  forgotPassword: async (email) => {
    if (USE_MOCK) return mockAuthService.forgotPassword(email);
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  /** POST /auth/reset-password - body: { token, newPassword } */
  resetPassword: async (token, newPassword) => {
    if (USE_MOCK) return mockAuthService.resetPassword(token, newPassword);
    const res = await apiClient.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },

  /** GET /users/me */
  getProfile: async () => {
    if (USE_MOCK) return mockAuthService.getProfile();
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  /** PATCH /users/me - body: partial user fields */
  updateProfile: async (data) => {
    if (USE_MOCK) return mockAuthService.updateProfile(data);
    const res = await apiClient.patch('/users/me', data);
    return res.data;
  },

  /** PATCH /users/me/password - body: { currentPassword, newPassword } */
  changePassword: async (currentPassword, newPassword) => {
    if (USE_MOCK) return mockAuthService.changePassword(currentPassword, newPassword);
    const res = await apiClient.patch('/users/me/password', { currentPassword, newPassword });
    return res.data;
  },

  /** DELETE /users/me */
  deleteAccount: async () => {
    if (USE_MOCK) return mockAuthService.deleteAccount();
    const res = await apiClient.delete('/users/me');
    clearAccessToken();
    return res.data;
  },
};

export default authService;
