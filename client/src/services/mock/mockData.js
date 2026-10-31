/**
 * Mock Data - Realistic demo data for frontend development
 * Based on the SRS Section 8.1 schema and the progress example in Section 11.3
 * 
 * This file provides all the seed data used by mock services.
 * When the backend is ready, set VITE_USE_MOCK=false and this won't be loaded.
 */

import { format, subDays, addDays } from 'date-fns';

const today = format(new Date(), 'yyyy-MM-dd');
const todayDate = new Date();

// ===== USER =====
export const mockUser = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@cadence.dev',
  role: 'user',
  timezone: 'Asia/Kolkata',
  avatarUrl: null,
  settings: {
    emailReminders: true,
    dailyDigest: true,
    deadlineAlerts: true,
    push: false,
    quietHours: { start: '22:00', end: '07:00' },
    weekStartsOn: 1, // Monday
  },
  lastLoginAt: new Date().toISOString(),
  createdAt: '2026-07-01T00:00:00Z',
};

// ===== OBJECTIVES =====
export const mockObjectives = [
  {
    id: 'obj1',
    user: 'u1',
    title: 'Improve Physical Fitness',
    description: 'Get in the best shape of my life this quarter through consistent exercise and better nutrition habits.',
    category: 'Health',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    status: 'active',
    progress: 60,
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: todayDate.toISOString(),
  },
  {
    id: 'obj2',
    user: 'u1',
    title: 'Master React & Node.js',
    description: 'Build production-ready full-stack skills by completing projects and contributing to open source.',
    category: 'Career',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    status: 'active',
    progress: 42,
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: todayDate.toISOString(),
  },
  {
    id: 'obj3',
    user: 'u1',
    title: 'Read 12 Books This Quarter',
    description: 'Develop a consistent reading habit to expand knowledge across business, technology, and personal growth.',
    category: 'Personal Growth',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    status: 'active',
    progress: 33,
    createdAt: '2026-10-01T08:30:00Z',
    updatedAt: todayDate.toISOString(),
  },
  {
    id: 'obj4',
    user: 'u1',
    title: 'Launch Side Project MVP',
    description: 'Design, build, and ship the first version of my SaaS product idea.',
    category: 'Projects',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    status: 'completed',
    progress: 100,
    createdAt: '2026-07-01T08:00:00Z',
    updatedAt: '2026-09-28T15:30:00Z',
  },
];

// ===== KEY RESULTS =====
export const mockKeyResults = [
  // Objective 1: Improve Physical Fitness
  {
    id: 'kr1',
    user: 'u1',
    objective: 'obj1',
    title: 'Run 150 km total',
    metricType: 'numeric',
    unit: 'km',
    startValue: 0,
    targetValue: 150,
    currentValue: 105,
    weight: 2,
    deadline: '2026-12-31',
    progress: 70,
    completedAt: null,
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'kr2',
    user: 'u1',
    objective: 'obj1',
    title: 'Complete 60 workout sessions',
    metricType: 'numeric',
    unit: 'sessions',
    startValue: 0,
    targetValue: 60,
    currentValue: 24,
    weight: 1,
    deadline: '2026-12-31',
    progress: 40,
    completedAt: null,
    createdAt: '2026-10-01T08:00:00Z',
  },

  // Objective 2: Master React & Node.js
  {
    id: 'kr3',
    user: 'u1',
    objective: 'obj2',
    title: 'Complete 3 full-stack projects',
    metricType: 'numeric',
    unit: 'projects',
    startValue: 0,
    targetValue: 3,
    currentValue: 1,
    weight: 3,
    deadline: '2026-12-31',
    progress: 33,
    completedAt: null,
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'kr4',
    user: 'u1',
    objective: 'obj2',
    title: 'Study 100 hours of coding tutorials',
    metricType: 'numeric',
    unit: 'hours',
    startValue: 0,
    targetValue: 100,
    currentValue: 55,
    weight: 2,
    deadline: '2026-12-31',
    progress: 55,
    completedAt: null,
    createdAt: '2026-10-01T08:00:00Z',
  },

  // Objective 3: Read 12 Books
  {
    id: 'kr5',
    user: 'u1',
    objective: 'obj3',
    title: 'Read 12 books',
    metricType: 'numeric',
    unit: 'books',
    startValue: 0,
    targetValue: 12,
    currentValue: 4,
    weight: 1,
    deadline: '2026-12-31',
    progress: 33,
    completedAt: null,
    createdAt: '2026-10-01T08:30:00Z',
  },

  // Objective 4: Completed
  {
    id: 'kr6',
    user: 'u1',
    objective: 'obj4',
    title: 'Ship MVP to production',
    metricType: 'boolean',
    unit: '',
    startValue: 0,
    targetValue: 1,
    currentValue: 1,
    weight: 1,
    deadline: '2026-09-30',
    progress: 100,
    completedAt: '2026-09-28T15:30:00Z',
    createdAt: '2026-07-01T08:00:00Z',
  },
];

// ===== HABITS =====
export const mockHabits = [
  {
    id: 'h1',
    user: 'u1',
    keyResult: 'kr1',
    title: 'Morning Run',
    frequency: { type: 'weekdays', days: [1, 2, 3, 4, 5] }, // Mon-Fri
    contributionValue: 5, // 5 km per run
    reminderTime: '06:30',
    status: 'active',
    currentStreak: 4,
    longestStreak: 12,
    lastCheckInDate: format(subDays(todayDate, 0), 'yyyy-MM-dd'),
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'h2',
    user: 'u1',
    keyResult: 'kr2',
    title: 'Gym Workout',
    frequency: { type: 'weekdays', days: [1, 3, 5] }, // Mon, Wed, Fri
    contributionValue: 1,
    reminderTime: '17:00',
    status: 'active',
    currentStreak: 3,
    longestStreak: 8,
    lastCheckInDate: format(subDays(todayDate, 1), 'yyyy-MM-dd'),
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'h3',
    user: 'u1',
    keyResult: 'kr4',
    title: 'Code for 2 hours',
    frequency: { type: 'daily' },
    contributionValue: 2,
    reminderTime: '09:00',
    status: 'active',
    currentStreak: 7,
    longestStreak: 15,
    lastCheckInDate: format(subDays(todayDate, 0), 'yyyy-MM-dd'),
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'h4',
    user: 'u1',
    keyResult: 'kr5',
    title: 'Read 30 minutes',
    frequency: { type: 'daily' },
    contributionValue: 0, // manual update for books
    reminderTime: '21:00',
    status: 'active',
    currentStreak: 2,
    longestStreak: 10,
    lastCheckInDate: format(subDays(todayDate, 0), 'yyyy-MM-dd'),
    createdAt: '2026-10-01T08:30:00Z',
  },
  {
    id: 'h5',
    user: 'u1',
    keyResult: 'kr2',
    title: 'Yoga Session',
    frequency: { type: 'weekdays', days: [2, 4, 6] }, // Tue, Thu, Sat
    contributionValue: 1,
    reminderTime: '07:00',
    status: 'active',
    currentStreak: 0,
    longestStreak: 6,
    lastCheckInDate: format(subDays(todayDate, 3), 'yyyy-MM-dd'),
    createdAt: '2026-10-05T10:00:00Z',
  },
  {
    id: 'h6',
    user: 'u1',
    keyResult: 'kr3',
    title: 'Work on Portfolio Project',
    frequency: { type: 'weekdays', days: [0, 6] }, // Sat, Sun
    contributionValue: 0,
    reminderTime: '10:00',
    status: 'active',
    currentStreak: 2,
    longestStreak: 4,
    lastCheckInDate: format(subDays(todayDate, 1), 'yyyy-MM-dd'),
    createdAt: '2026-10-05T10:00:00Z',
  },
];

// ===== GENERATE CHECK-INS =====
// Generate 60 days of realistic check-in data
export const generateMockCheckIns = () => {
  const checkIns = [];
  for (let d = 60; d >= 0; d--) {
    const date = format(subDays(todayDate, d), 'yyyy-MM-dd');
    const dayOfWeek = subDays(todayDate, d).getDay();

    mockHabits.forEach((habit) => {
      // Determine if this habit was scheduled on this day
      let isScheduled = false;
      if (habit.frequency.type === 'daily') {
        isScheduled = true;
      } else if (habit.frequency.type === 'weekdays') {
        isScheduled = habit.frequency.days.includes(dayOfWeek);
      }

      if (isScheduled) {
        // ~75% completion rate for realism
        const completed = Math.random() < 0.75;
        if (completed) {
          checkIns.push({
            id: `ci-${habit.id}-${date}`,
            user: 'u1',
            habit: habit.id,
            keyResult: habit.keyResult,
            date,
            value: habit.contributionValue || 1,
            note: '',
            createdAt: `${date}T08:00:00Z`,
          });
        }
      }
    });
  }
  return checkIns;
};

export const mockCheckIns = generateMockCheckIns();

// ===== NOTIFICATIONS =====
export const mockNotifications = [
  {
    id: 'n1',
    user: 'u1',
    type: 'reminder',
    message: "Don't forget your Morning Run today! 🏃‍♂️",
    read: false,
    relatedRef: { model: 'Habit', id: 'h1' },
    createdAt: new Date(todayDate.getTime() - 3600000).toISOString(),
  },
  {
    id: 'n2',
    user: 'u1',
    type: 'deadline',
    message: 'Key Result "Run 150 km" deadline is in 2 months. You\'re at 70%! Keep going! 🎯',
    read: false,
    relatedRef: { model: 'KeyResult', id: 'kr1' },
    createdAt: new Date(todayDate.getTime() - 7200000).toISOString(),
  },
  {
    id: 'n3',
    user: 'u1',
    type: 'system',
    message: '🔥 New streak record! 15 days for "Code for 2 hours"',
    read: true,
    relatedRef: { model: 'Habit', id: 'h3' },
    createdAt: new Date(todayDate.getTime() - 86400000).toISOString(),
  },
  {
    id: 'n4',
    user: 'u1',
    type: 'reminder',
    message: 'Time for your daily reading! 📚',
    read: true,
    relatedRef: { model: 'Habit', id: 'h4' },
    createdAt: new Date(todayDate.getTime() - 86400000 * 2).toISOString(),
  },
];

// ===== DASHBOARD TRENDS =====
export const generateMockTrends = (weeks = 12) => {
  const trends = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const weekStart = format(subDays(todayDate, w * 7), 'yyyy-MM-dd');
    // Gradual improvement trend
    const baseRate = 55 + (weeks - w) * 2;
    const rate = Math.min(100, Math.max(0, baseRate + (Math.random() * 20 - 10)));
    trends.push({
      week: weekStart,
      completionRate: Math.round(rate),
      completed: Math.round(rate * 0.3),
      scheduled: 30,
    });
  }
  return trends;
};

// ===== REPORTS =====
export const mockReports = [
  {
    id: 'r1',
    user: 'u1',
    period: 'weekly',
    from: format(subDays(todayDate, 7), 'yyyy-MM-dd'),
    to: format(subDays(todayDate, 1), 'yyyy-MM-dd'),
    generatedAt: subDays(todayDate, 1).toISOString(),
    summary: {
      overallProgress: 48,
      habitCompletionRate: 73,
      totalCheckIns: 22,
      bestHabit: 'Code for 2 hours',
      worstHabit: 'Yoga Session',
    },
  },
];
