/**
 * Habit & Check-in Service
 * Maps to: SRS Section 7.4 endpoints
 */

import apiClient from './api';
import { mockHabitService } from './mock/mockHabits';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const habitService = {
  // ======== HABITS ========

  /** GET /habits?keyResultId=&status=&dueOn=YYYY-MM-DD */
  getHabits: async (params = {}) => {
    if (USE_MOCK) return mockHabitService.getHabits(params);
    const res = await apiClient.get('/habits', { params });
    return res.data;
  },

  /** POST /habits */
  createHabit: async (data) => {
    if (USE_MOCK) return mockHabitService.createHabit(data);
    const res = await apiClient.post('/habits', data);
    return res.data;
  },

  /** GET /habits/:id */
  getHabit: async (id) => {
    if (USE_MOCK) return mockHabitService.getHabit(id);
    const res = await apiClient.get(`/habits/${id}`);
    return res.data;
  },

  /** PATCH /habits/:id */
  updateHabit: async (id, data) => {
    if (USE_MOCK) return mockHabitService.updateHabit(id, data);
    const res = await apiClient.patch(`/habits/${id}`, data);
    return res.data;
  },

  /** DELETE /habits/:id?hard=true */
  deleteHabit: async (id, hard = false) => {
    if (USE_MOCK) return mockHabitService.deleteHabit(id, hard);
    const res = await apiClient.delete(`/habits/${id}`, { params: hard ? { hard: true } : {} });
    return res.data;
  },

  // ======== CHECK-INS ========

  /** POST /habits/:id/check-ins - body: { date, value?, note? } */
  createCheckIn: async (habitId, data) => {
    if (USE_MOCK) return mockHabitService.createCheckIn(habitId, data);
    const res = await apiClient.post(`/habits/${habitId}/check-ins`, data);
    return res.data;
  },

  /** DELETE /habits/:id/check-ins/:date */
  deleteCheckIn: async (habitId, date) => {
    if (USE_MOCK) return mockHabitService.deleteCheckIn(habitId, date);
    const res = await apiClient.delete(`/habits/${habitId}/check-ins/${date}`);
    return res.data;
  },

  /** GET /habits/:id/check-ins?from=&to= */
  getCheckIns: async (habitId, params = {}) => {
    if (USE_MOCK) return mockHabitService.getCheckIns(habitId, params);
    const res = await apiClient.get(`/habits/${habitId}/check-ins`, { params });
    return res.data;
  },

  /** GET /check-ins?from=&to= - all check-ins for calendar view */
  getAllCheckIns: async (params = {}) => {
    if (USE_MOCK) return mockHabitService.getAllCheckIns(params);
    const res = await apiClient.get('/check-ins', { params });
    return res.data;
  },
};

export default habitService;
