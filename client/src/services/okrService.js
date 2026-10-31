/**
 * OKR Service (Objectives + Key Results)
 * Maps to: SRS Section 7.3 endpoints
 * 
 * BACKEND INTEGRATION: Switch VITE_USE_MOCK to false and all calls go to real API.
 */

import apiClient from './api';
import { mockOkrService } from './mock/mockOkr';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const okrService = {
  // ======== OBJECTIVES ========

  /** GET /objectives?status=&from=&to=&q=&page=&limit=&sort= */
  getObjectives: async (params = {}) => {
    if (USE_MOCK) return mockOkrService.getObjectives(params);
    const res = await apiClient.get('/objectives', { params });
    return res.data;
  },

  /** POST /objectives - body: { title, description, category, startDate, endDate } */
  createObjective: async (data) => {
    if (USE_MOCK) return mockOkrService.createObjective(data);
    const res = await apiClient.post('/objectives', data);
    return res.data;
  },

  /** GET /objectives/:id */
  getObjective: async (id) => {
    if (USE_MOCK) return mockOkrService.getObjective(id);
    const res = await apiClient.get(`/objectives/${id}`);
    return res.data;
  },

  /** PATCH /objectives/:id */
  updateObjective: async (id, data) => {
    if (USE_MOCK) return mockOkrService.updateObjective(id, data);
    const res = await apiClient.patch(`/objectives/${id}`, data);
    return res.data;
  },

  /** PATCH /objectives/:id/archive - body: { archived: true/false } */
  archiveObjective: async (id, archived = true) => {
    if (USE_MOCK) return mockOkrService.archiveObjective(id, archived);
    const res = await apiClient.patch(`/objectives/${id}/archive`, { archived });
    return res.data;
  },

  /** DELETE /objectives/:id */
  deleteObjective: async (id) => {
    if (USE_MOCK) return mockOkrService.deleteObjective(id);
    const res = await apiClient.delete(`/objectives/${id}`);
    return res.data;
  },

  // ======== KEY RESULTS ========

  /** GET /objectives/:objectiveId/key-results */
  getKeyResults: async (objectiveId) => {
    if (USE_MOCK) return mockOkrService.getKeyResults(objectiveId);
    const res = await apiClient.get(`/objectives/${objectiveId}/key-results`);
    return res.data;
  },

  /** POST /objectives/:objectiveId/key-results */
  createKeyResult: async (objectiveId, data) => {
    if (USE_MOCK) return mockOkrService.createKeyResult(objectiveId, data);
    const res = await apiClient.post(`/objectives/${objectiveId}/key-results`, data);
    return res.data;
  },

  /** GET /key-results/:id */
  getKeyResult: async (id) => {
    if (USE_MOCK) return mockOkrService.getKeyResult(id);
    const res = await apiClient.get(`/key-results/${id}`);
    return res.data;
  },

  /** PATCH /key-results/:id */
  updateKeyResult: async (id, data) => {
    if (USE_MOCK) return mockOkrService.updateKeyResult(id, data);
    const res = await apiClient.patch(`/key-results/${id}`, data);
    return res.data;
  },

  /** DELETE /key-results/:id */
  deleteKeyResult: async (id) => {
    if (USE_MOCK) return mockOkrService.deleteKeyResult(id);
    const res = await apiClient.delete(`/key-results/${id}`);
    return res.data;
  },

  /** GET /key-results/:id/history */
  getKeyResultHistory: async (id) => {
    if (USE_MOCK) return mockOkrService.getKeyResultHistory(id);
    const res = await apiClient.get(`/key-results/${id}/history`);
    return res.data;
  },
};

export default okrService;
