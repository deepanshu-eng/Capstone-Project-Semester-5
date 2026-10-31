/**
 * Mock Habit & Check-in Service
 */

import { mockHabits, mockCheckIns } from './mockData';
import { format } from 'date-fns';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
let habits = [...mockHabits];
let checkIns = [...mockCheckIns];

export const mockHabitService = {
  getHabits: async (params = {}) => {
    await delay();
    let filtered = [...habits];
    if (params.status) filtered = filtered.filter((h) => h.status === params.status);
    if (params.keyResultId) filtered = filtered.filter((h) => h.keyResult === params.keyResultId);
    if (params.dueOn) {
      const dayOfWeek = new Date(params.dueOn).getDay();
      filtered = filtered.filter((h) => {
        if (h.frequency.type === 'daily') return true;
        if (h.frequency.type === 'weekdays') return h.frequency.days.includes(dayOfWeek);
        return true;
      });
    }
    return { success: true, data: filtered };
  },

  createHabit: async (data) => {
    await delay(500);
    const newHabit = {
      id: `h${Date.now()}`,
      user: 'u1',
      ...data,
      status: 'active',
      currentStreak: 0,
      longestStreak: 0,
      lastCheckInDate: null,
      createdAt: new Date().toISOString(),
    };
    habits.push(newHabit);
    return { success: true, data: newHabit };
  },

  getHabit: async (id) => {
    await delay();
    const habit = habits.find((h) => h.id === id);
    if (!habit) throw { response: { data: { error: { code: 'NOT_FOUND' } } } };
    const recentCheckIns = checkIns.filter((ci) => ci.habit === id).slice(-14);
    return { success: true, data: { ...habit, checkIns: recentCheckIns } };
  },

  updateHabit: async (id, data) => {
    await delay(400);
    const idx = habits.findIndex((h) => h.id === id);
    if (idx === -1) throw { response: { data: { error: { code: 'NOT_FOUND' } } } };
    habits[idx] = { ...habits[idx], ...data };
    return { success: true, data: habits[idx] };
  },

  deleteHabit: async (id, hard) => {
    await delay(400);
    if (hard) {
      habits = habits.filter((h) => h.id !== id);
    } else {
      const idx = habits.findIndex((h) => h.id === id);
      if (idx !== -1) habits[idx].status = 'archived';
    }
    return { success: true };
  },

  createCheckIn: async (habitId, data) => {
    await delay(400);
    // Check for duplicate (BE-HAB-03)
    const existing = checkIns.find((ci) => ci.habit === habitId && ci.date === data.date);
    if (existing) {
      throw { response: { status: 409, data: { error: { code: 'DUPLICATE_CHECKIN', message: 'Already checked in for this date' } } } };
    }

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) throw { response: { data: { error: { code: 'NOT_FOUND' } } } };

    const newCheckIn = {
      id: `ci-${habitId}-${data.date}`,
      user: 'u1',
      habit: habitId,
      keyResult: habit.keyResult,
      date: data.date,
      value: data.value || habit.contributionValue || 1,
      note: data.note || '',
      createdAt: new Date().toISOString(),
    };
    checkIns.push(newCheckIn);

    // Update streak (simplified)
    const habitIdx = habits.findIndex((h) => h.id === habitId);
    if (habitIdx !== -1) {
      habits[habitIdx].currentStreak += 1;
      habits[habitIdx].longestStreak = Math.max(habits[habitIdx].longestStreak, habits[habitIdx].currentStreak);
      habits[habitIdx].lastCheckInDate = data.date;
    }

    return {
      success: true,
      data: {
        checkIn: newCheckIn,
        habit: habits[habitIdx],
        keyResult: { id: habit.keyResult, progress: 70 },
        objective: { id: 'obj1', progress: 60 },
      },
    };
  },

  deleteCheckIn: async (habitId, date) => {
    await delay(400);
    checkIns = checkIns.filter((ci) => !(ci.habit === habitId && ci.date === date));
    const habitIdx = habits.findIndex((h) => h.id === habitId);
    if (habitIdx !== -1 && habits[habitIdx].currentStreak > 0) {
      habits[habitIdx].currentStreak -= 1;
    }
    return { success: true, data: { habit: habits[habitIdx] } };
  },

  getCheckIns: async (habitId, params = {}) => {
    await delay();
    let filtered = checkIns.filter((ci) => ci.habit === habitId);
    if (params.from) filtered = filtered.filter((ci) => ci.date >= params.from);
    if (params.to) filtered = filtered.filter((ci) => ci.date <= params.to);
    return { success: true, data: filtered };
  },

  getAllCheckIns: async (params = {}) => {
    await delay();
    let filtered = [...checkIns];
    if (params.from) filtered = filtered.filter((ci) => ci.date >= params.from);
    if (params.to) filtered = filtered.filter((ci) => ci.date <= params.to);
    return { success: true, data: filtered };
  },
};
