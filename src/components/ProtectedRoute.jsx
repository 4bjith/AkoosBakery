import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If user is admin but trying to access customer dashboard, go to admin
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    
    // If user is customer but trying to access admin, go to customer dashboard
    return <Navigate to="/dashboard/products" replace />;
  }

  return children;
}
