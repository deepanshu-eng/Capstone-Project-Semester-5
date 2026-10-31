/**
 * Notification Service
 * Maps to: SRS Section 7.5 notification endpoints
 */

import apiClient from './api';
import { mockNotificationService } from './mock/mockNotifications';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const notificationService = {
  /** GET /notifications?unread=true */
  getNotifications: async (params = {}) => {
    if (USE_MOCK) return mockNotificationService.getNotifications(params);
    const res = await apiClient.get('/notifications', { params });
    return res.data;
  },

  /** PATCH /notifications/:id/read */
  markAsRead: async (id) => {
    if (USE_MOCK) return mockNotificationService.markAsRead(id);
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data;
  },

  /** PATCH /notifications/read-all */
  markAllAsRead: async () => {
    if (USE_MOCK) return mockNotificationService.markAllAsRead();
    const res = await apiClient.patch('/notifications/read-all');
    return res.data;
  },
};

export default notificationService;
