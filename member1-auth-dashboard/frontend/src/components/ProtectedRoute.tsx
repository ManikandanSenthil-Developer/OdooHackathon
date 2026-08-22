import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'EMPLOYEE')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        gap: '16px'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          border: '4px solid #E9F1FA',
          borderTop: '4px solid #00ABE4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6B7280', fontWeight: 600 }}>Authenticating session...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not logged in -> Redirect to login page
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check -> Block unauthorized roles
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'EMPLOYEE') {
      return <Navigate to="/employee-dashboard" replace />;
    } else if (currentUser.role === 'ADMIN') {
      return <Navigate to="/admin-dashboard" replace />;
    }
  }

  return <>{children}</>;
};
