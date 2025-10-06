import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Custom hook to handle route protection and navigation guards
 */
export const useRouteGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useApp();

  useEffect(() => {
    const currentPath = location.pathname;

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/profile', '/qa-history', '/subject', '/pdf'];
    const adminRoutes = ['/admin'];
    const authRoutes = ['/login', '/register'];

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      currentPath.startsWith(route)
    );

    const isAdminRoute = adminRoutes.some(route => 
      currentPath.startsWith(route)
    );

    const isAuthRoute = authRoutes.some(route => 
      currentPath.startsWith(route)
    );

    // Redirect logic
    if (isProtectedRoute && !isAuthenticated) {
      // Unauthenticated user trying to access protected route
      navigate('/unauthorized', { replace: true });
    } else if (isAdminRoute && (!isAuthenticated || !isAdmin())) {
      // Non-admin user trying to access admin route
      if (!isAuthenticated) {
        navigate('/unauthorized', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else if (isAuthRoute && isAuthenticated) {
      // Authenticated user trying to access auth pages
      navigate('/dashboard', { replace: true });
    }
  }, [location.pathname, isAuthenticated, isAdmin, navigate]);

  return {
    isAuthenticated,
    isAdmin: isAdmin(),
    user,
    currentPath: location.pathname
  };
};

/**
 * Hook to check if user can access a specific route
 */
export const useCanAccess = (routePath) => {
  const { isAuthenticated, isAdmin } = useApp();

  const canAccess = (path) => {
    // Public routes
    if (['/login', '/register', '/unauthorized', '/404'].includes(path)) {
      return true;
    }

    // Auth routes (only for non-authenticated users)
    if (['/login', '/register'].includes(path)) {
      return !isAuthenticated;
    }

    // Protected routes (require authentication)
    const protectedRoutes = ['/dashboard', '/profile', '/qa-history', '/subject', '/pdf'];
    if (protectedRoutes.some(route => path.startsWith(route))) {
      return isAuthenticated;
    }

    // Admin routes (require admin role)
    if (path.startsWith('/admin')) {
      return isAuthenticated && isAdmin();
    }

    return false;
  };

  return canAccess(routePath);
};

export default useRouteGuard;