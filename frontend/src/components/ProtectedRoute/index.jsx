import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
}
