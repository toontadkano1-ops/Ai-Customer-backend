import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-dark-bg text-slate-300">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mb-4" />
        <p className="text-sm font-medium">Verifying session credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
