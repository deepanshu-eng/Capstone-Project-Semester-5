/**
 * Mock Dashboard Service
 */

import { mockObjectives, mockKeyResults, mockHabits, mockCheckIns, generateMockTrends } from './mockData';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const mockDashboardService = {
  getSummary: async () => {
    await delay(500);
    const today = format(new Date(), 'yyyy-MM-dd');
    const dayOfWeek = new Date().getDay();

    // Today's habits
    const todaysHabits = mockHabits
      .filter((h) => h.status === 'active')
      .filter((h) => {
        if (h.frequency.type === 'daily') return true;
        if (h.frequency.type === 'weekdays') return h.frequency.days.includes(dayOfWeek);
        return true;
      })
      .map((h) => {
        const checkedIn = mockCheckIns.some((ci) => ci.habit === h.id && ci.date === today);
        return { ...h, checkedInToday: checkedIn };
      });

    // Active objectives
    const activeObjectives = mockObjectives.filter((o) => o.status === 'active');

    // Overall progress
    const overallProgress = activeObjectives.length > 0
      ? Math.round(activeObjectives.reduce((sum, o) => sum + o.progress, 0) / activeObjectives.length)
      : 0;

    // Upcoming deadlines (next 14 days)
    const upcomingDeadlines = mockKeyResults
      .filter((kr) => {
        const deadline = new Date(kr.deadline);
        const now = new Date();
        const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 14 && kr.progress < 100;
      })
      .map((kr) => ({
        ...kr,
        objectiveTitle: mockObjectives.find((o) => o.id === kr.objective)?.title,
      }));

    // Top streaks
    const topStreaks = [...mockHabits]
      .filter((h) => h.status === 'active')
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 5);

    return {
      success: true,
      data: {
        todaysHabits,
        overallProgress,
        activeObjectives,
        upcomingDeadlines,
        topStreaks,
        stats: {
          totalObjectives: mockObjectives.length,
          activeObjectives: activeObjectives.length,
          totalHabits: mockHabits.filter((h) => h.status === 'active').length,
          todayCompleted: todaysHabits.filter((h) => h.checkedInToday).length,
          todayTotal: todaysHabits.length,
        },
      },
    };
  },

  getTrends: async (weeks = 12) => {
    await delay(400);
    return { success: true, data: generateMockTrends(weeks) };
  },

  getCalendar: async (month) => {
    await delay(400);
    const [year, m] = month.split('-').map(Number);
    const start = startOfMonth(new Date(year, m - 1));
    const end = endOfMonth(start);
    const days = eachDayOfInterval({ start, end });

    const calendarData = days.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayOfWeek = getDay(day);

      // Count scheduled habits
      let scheduled = 0;
      let completed = 0;
      mockHabits.forEach((h) => {
        if (h.status !== 'active') return;
        let isScheduled = false;
        if (h.frequency.type === 'daily') isScheduled = true;
        else if (h.frequency.type === 'weekdays') isScheduled = h.frequency.days.includes(dayOfWeek);
        if (isScheduled) {
          scheduled++;
          if (mockCheckIns.some((ci) => ci.habit === h.id && ci.date === dateStr)) {
            completed++;
          }
        }
      });

      let state = 'none';
      if (scheduled > 0) {
        if (completed === scheduled) state = 'complete';
        else if (completed > 0) state = 'partial';
        else state = 'missed';
      }

      return { date: dateStr, scheduled, completed, state };
    });

    return { success: true, data: calendarData };
  },
};
