/**
 * Redux Store Configuration
 * Slices: auth, objectives, keyResults, habits, checkins, dashboard, notifications, ui
 * (FE-ST-01)
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import objectivesReducer from './slices/objectivesSlice';
import habitsReducer from './slices/habitsSlice';
import dashboardReducer from './slices/dashboardSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    objectives: objectivesReducer,
    habits: habitsReducer,
    dashboard: dashboardReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
