import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppData } from '../context/AppContext';

export default function RequireAuth({ children }) {
  const { isAuthenticated, isInitialized, isCacheLoading } = useAppData();
  const location = useLocation();

  if (!isInitialized || isCacheLoading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-road-navy/20 border-t-road-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
