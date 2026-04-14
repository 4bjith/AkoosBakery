import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      toast.error('Session expired. Please log in again. ⏰');
      hasShownToast.current = true;
    }
    if (isAuthenticated) {
      hasShownToast.current = false;
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If user is admin but trying to access other dashboards, go to admin
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    
    // If user is staff but trying to access other dashboards, go to staff
    if (user?.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
    
    // If user is customer but trying to access other dashboards, go to customer dashboard
    return <Navigate to="/dashboard/products" replace />;
  }

  return children;
}
