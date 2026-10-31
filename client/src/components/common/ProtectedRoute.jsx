import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted URL for redirect after login (FE-AUTH-05)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
