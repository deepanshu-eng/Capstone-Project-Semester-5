import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSessionExpired } from './store/slices/authSlice';
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public pages - eager load (small)
import LandingPage from './features/landing/LandingPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import NotFoundPage from './features/NotFoundPage';

// Private pages - lazy loaded (FE-QL-02)
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const TodayPage = lazy(() => import('./features/today/TodayPage'));
const ObjectivesPage = lazy(() => import('./features/okr/ObjectivesPage'));
const ObjectiveDetailPage = lazy(() => import('./features/okr/ObjectiveDetailPage'));
const NewObjectivePage = lazy(() => import('./features/okr/NewObjectivePage'));
const HabitsPage = lazy(() => import('./features/habits/HabitsPage'));
const HabitDetailPage = lazy(() => import('./features/habits/HabitDetailPage'));
const CalendarPage = lazy(() => import('./features/calendar/CalendarPage'));
const ReportsPage = lazy(() => import('./features/reports/ReportsPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));

function App() {
  const dispatch = useDispatch();

  // Listen for session-expired event from the API client (FE-AUTH-07)
  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(setSessionExpired());
    };
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/today"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <TodayPage />
                </Suspense>
              }
            />
            <Route
              path="/objectives"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <ObjectivesPage />
                </Suspense>
              }
            />
            <Route
              path="/objectives/new"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <NewObjectivePage />
                </Suspense>
              }
            />
            <Route
              path="/objectives/:id"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <ObjectiveDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/habits"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <HabitsPage />
                </Suspense>
              }
            />
            <Route
              path="/habits/:id"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <HabitDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/calendar"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <CalendarPage />
                </Suspense>
              }
            />
            <Route
              path="/reports"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <ReportsPage />
                </Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <SettingsPage />
                </Suspense>
              }
            />
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
