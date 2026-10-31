/**
 * Mock Notification Service
 */

import { mockNotifications } from './mockData';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));
let notifications = [...mockNotifications];

export const mockNotificationService = {
  getNotifications: async (params = {}) => {
    await delay();
    let filtered = [...notifications];
    if (params.unread) filtered = filtered.filter((n) => !n.read);
    return { success: true, data: filtered };
  },

  markAsRead: async (id) => {
    await delay();
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx !== -1) notifications[idx].read = true;
    return { success: true };
  },

  markAllAsRead: async () => {
    await delay();
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return { success: true };
  },
};
