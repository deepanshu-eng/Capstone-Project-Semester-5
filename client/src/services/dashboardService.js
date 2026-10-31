/**
 * Dashboard Service
 * Maps to: SRS Section 7.5 dashboard endpoints
 */

import apiClient from './api';
import { mockDashboardService } from './mock/mockDashboard';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const dashboardService = {
  /** GET /dashboard/summary */
  getSummary: async () => {
    if (USE_MOCK) return mockDashboardService.getSummary();
    const res = await apiClient.get('/dashboard/summary');
    return res.data;
  },

  /** GET /dashboard/trends?weeks=12 */
  getTrends: async (weeks = 12) => {
    if (USE_MOCK) return mockDashboardService.getTrends(weeks);
    const res = await apiClient.get('/dashboard/trends', { params: { weeks } });
    return res.data;
  },

  /** GET /dashboard/calendar?month=YYYY-MM */
  getCalendar: async (month) => {
    if (USE_MOCK) return mockDashboardService.getCalendar(month);
    const res = await apiClient.get('/dashboard/calendar', { params: { month } });
    return res.data;
  },
};

export default dashboardService;
