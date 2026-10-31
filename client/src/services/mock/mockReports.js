/**
 * Mock Report Service
 */

import { mockReports } from './mockData';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const mockReportService = {
  generateReport: async (data) => {
    await delay(1500);
    return {
      success: true,
      data: {
        id: `r${Date.now()}`,
        period: data.period,
        generatedAt: new Date().toISOString(),
        summary: {
          overallProgress: 52,
          habitCompletionRate: 76,
          totalCheckIns: 28,
          bestHabit: 'Code for 2 hours',
          worstHabit: 'Yoga Session',
        },
      },
    };
  },

  getReports: async () => {
    await delay();
    return { success: true, data: mockReports };
  },

  downloadReport: async (id) => {
    await delay(500);
    // In mock mode, return a message instead of a PDF blob
    return { mockDownload: true, message: 'PDF download would happen here with real backend' };
  },
};
