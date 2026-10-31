/**
 * Report Service
 * Maps to: SRS Section 7.5 report endpoints
 */

import apiClient from './api';
import { mockReportService } from './mock/mockReports';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const reportService = {
  /** POST /reports - body: { period, anchorDate } */
  generateReport: async (data) => {
    if (USE_MOCK) return mockReportService.generateReport(data);
    const res = await apiClient.post('/reports', data);
    return res.data;
  },

  /** GET /reports */
  getReports: async () => {
    if (USE_MOCK) return mockReportService.getReports();
    const res = await apiClient.get('/reports');
    return res.data;
  },

  /** GET /reports/:id/download */
  downloadReport: async (id) => {
    if (USE_MOCK) return mockReportService.downloadReport(id);
    const res = await apiClient.get(`/reports/${id}/download`, { responseType: 'blob' });
    return res.data;
  },
};

export default reportService;
