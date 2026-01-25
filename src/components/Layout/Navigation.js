import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

/**
 * Enhanced navigation component with route validation
 */
const Navigation = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useApp();

  // Helper function to check if a route should be accessible
  const canAccessRoute = (routePath) => {
    // Public routes
    if (["/login", "/register", "/unauthorized"].includes(routePath)) {
      return true;
    }

    // Protected routes require authentication
    const protectedRoutes = [
      "/dashboard",
      "/profile",
      "/qa-history",
      "/subjects",
    ];
    if (
      protectedRoutes.includes(routePath) ||
      routePath.startsWith("/subject/") ||
      routePath.startsWith("/pdf/")
    ) {
      return isAuthenticated;
    }

    // Admin routes require admin role
    if (routePath.startsWith("/admin")) {
      return isAuthenticated && isAdmin();
    }

    return false;
  };

  // Enhanced NavLink component with access control
  const SecureNavLink = ({ to, children, ...props }) => {
    const hasAccess = canAccessRoute(to);

    if (!hasAccess) {
      return (
        <span
          className="opacity-50 cursor-not-allowed"
          title="Access restricted"
        >
          {children}
        </span>
      );
    }

    return (
      <NavLink to={to} {...props}>
        {children}
      </NavLink>
    );
  };

  return { SecureNavLink, canAccessRoute, currentPath: location.pathname };
};

export default Navigation;
