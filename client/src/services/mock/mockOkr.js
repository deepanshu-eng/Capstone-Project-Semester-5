/**
 * Mock OKR Service
 */

import { mockObjectives, mockKeyResults } from './mockData';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
let objectives = [...mockObjectives];
let keyResults = [...mockKeyResults];

export const mockOkrService = {
  getObjectives: async (params = {}) => {
    await delay();
    let filtered = [...objectives];
    if (params.status) filtered = filtered.filter((o) => o.status === params.status);
    if (params.q) filtered = filtered.filter((o) => o.title.toLowerCase().includes(params.q.toLowerCase()));
    return {
      success: true,
      data: filtered,
      meta: { page: 1, limit: 20, total: filtered.length },
    };
  },

  createObjective: async (data) => {
    await delay(500);
    const newObj = {
      id: `obj${Date.now()}`,
      user: 'u1',
      ...data,
      status: 'active',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    objectives.push(newObj);
    return { success: true, data: newObj };
  },

  getObjective: async (id) => {
    await delay();
    const obj = objectives.find((o) => o.id === id);
    if (!obj) throw { response: { data: { error: { code: 'NOT_FOUND' } } } };
    const krs = keyResults.filter((kr) => kr.objective === id);
    return { success: true, data: { ...obj, keyResults: krs } };
  },

  updateObjective: async (id, data) => {
    await delay(400);
    const idx = objectives.findIndex((o) => o.id === id);
    if (idx === -1) throw { response: { data: { error: { code: 'NOT_FOUND' } } } };
    objectives[idx] = { ...objectives[idx], ...data, updatedAt: new Date().toISOString() };
    return { success: true, data: objectives[idx] };
  },

  archiveObjective: async (id, archived) => {
    await delay(400);
    const idx = objectives.findIndex((o) => o.id === id);
    if (idx === -1) throw { response: { data: { error: { code: 'NOT_FOUND' } } } };
    objectives[idx].status = archived ? 'archived' : 'active';
    return { success: true, data: objectives[idx] };
  },

  deleteObjective: async (id) => {
    await delay(400);
    objectives = objectives.filter((o) => o.id !== id);
    keyResults = keyResults.filter((kr) => kr.objective !== id);
    return { success: true };
  },

  getKeyResults: async (objectiveId) => {
    await delay();
    const krs = keyResults.filter((kr) => kr.objective === objectiveId);
    return { success: true, data: krs };
  },

  createKeyResult: async (objectiveId, data) => {
    await delay(500);
    const newKr = {
      id: `kr${Date.now()}`,
      user: 'u1',
      objective: objectiveId,
      ...data,
      currentValue: data.startValue || 0,
      progress: 0,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    keyResults.push(newKr);
    return { success: true, data: newKr };
  },

  getKeyResult: async (id) => {
    await delay();
    const kr = keyResults.find((k) => k.id === id);
    if (!kr) throw { response: { data: { error: { code: 'NOT_FOUND' } } } };
    return { success: true, data: kr };
  },

  updateKeyResult: async (id, data) => {
    await delay(400);
    const idx = keyResults.findIndex((k) => k.id === id);
    if (idx === -1) throw { response: { data: { error: { code: 'NOT_FOUND' } } } };
    keyResults[idx] = { ...keyResults[idx], ...data };
    // Recalculate progress if currentValue changed (BE-PRG-02)
    if (data.currentValue !== undefined) {
      const kr = keyResults[idx];
      kr.progress = Math.min(100, Math.max(0,
        ((kr.currentValue - kr.startValue) / (kr.targetValue - kr.startValue)) * 100
      ));
    }
    return { success: true, data: keyResults[idx] };
  },

  deleteKeyResult: async (id) => {
    await delay(400);
    keyResults = keyResults.filter((k) => k.id !== id);
    return { success: true };
  },

  getKeyResultHistory: async (id) => {
    await delay();
    // Generate 30 days of progress history
    const history = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      history.push({
        date: date.toISOString().split('T')[0],
        progress: Math.min(100, Math.round((30 - i) * 2.3 + Math.random() * 5)),
      });
    }
    return { success: true, data: history };
  },
};
