/**
 * Mock Auth Service - simulates backend auth endpoints
 */

import { mockUser } from './mockData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const mockAuthService = {
  register: async (data) => {
    await delay();
    const user = { ...mockUser, name: data.name, email: data.email, timezone: data.timezone || 'Asia/Kolkata' };
    return { success: true, data: { user, accessToken: 'mock-access-token' } };
  },

  login: async ({ email, password }) => {
    await delay(600);
    if (email === 'alex@cadence.dev' && password === 'password123') {
      return { success: true, data: { user: mockUser, accessToken: 'mock-access-token' } };
    }
    // Also accept any email/password combo for easy testing
    if (password && password.length >= 8) {
      return { success: true, data: { user: { ...mockUser, email }, accessToken: 'mock-access-token' } };
    }
    throw { response: { data: { success: false, error: { code: 'UNAUTHENTICATED', message: 'Invalid email or password' } } } };
  },

  logout: async () => {
    await delay(200);
    return { success: true };
  },

  refresh: async () => {
    await delay(200);
    return { success: true, data: { accessToken: 'mock-access-token-refreshed' } };
  },

  forgotPassword: async (email) => {
    await delay(800);
    return { success: true, data: { message: 'If that email is registered, a reset link has been sent.' } };
  },

  resetPassword: async (token, newPassword) => {
    await delay(600);
    return { success: true, data: { message: 'Password reset successfully.' } };
  },

  getProfile: async () => {
    await delay(300);
    return { success: true, data: mockUser };
  },

  updateProfile: async (data) => {
    await delay(400);
    return { success: true, data: { ...mockUser, ...data } };
  },

  changePassword: async () => {
    await delay(500);
    return { success: true, data: { message: 'Password changed successfully.' } };
  },

  deleteAccount: async () => {
    await delay(500);
    return { success: true };
  },
};
