import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * Component to handle global route protection
 * This runs on every route change to ensure proper access control
 */
const RouteProtection = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useApp();

  useEffect(() => {
    const currentPath = location.pathname;

    // Log route access for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🛡️ Route Guard: ${currentPath} | Auth: ${isAuthenticated} | Admin: ${isAdmin()}`);
    }

    // Define route patterns
    const publicRoutes = ['/unauthorized', '/404'];
    const authRoutes = ['/login', '/register'];
    const protectedRoutes = ['/dashboard', '/profile', '/qa-history'];
    const adminRoutes = ['/admin'];

    // Check route type
    const isPublicRoute = publicRoutes.includes(currentPath);
    const isAuthRoute = authRoutes.includes(currentPath);
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route)) || 
                           currentPath.startsWith('/subject/') || 
                           currentPath.startsWith('/pdf/');
    const isAdminRoute = adminRoutes.some(route => currentPath.startsWith(route));

    // Apply route protection logic
    if (isPublicRoute) {
      // Public routes are always accessible
      return;
    }

    if (isAuthRoute && isAuthenticated) {
      // Redirect authenticated users away from auth pages
      navigate('/dashboard', { replace: true });
      return;
    }

    if ((isProtectedRoute || isAdminRoute) && !isAuthenticated) {
      // Redirect unauthenticated users to unauthorized page
      navigate('/unauthorized', { replace: true });
      return;
    }

    if (isAdminRoute && isAuthenticated && !isAdmin()) {
      // Redirect non-admin users away from admin pages
      navigate('/dashboard', { replace: true });
      return;
    }

  }, [location.pathname, isAuthenticated, isAdmin, navigate]);

  return children;
};

export default RouteProtection;