import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppData } from '../context/AppContext';

export default function RequireGuest({ children }) {
  const { isAuthenticated, isInitialized } = useAppData();
  const location = useLocation();

  if (!isInitialized) return null; // Prevent flash during hydration

  if (isAuthenticated) {
    // If the user is already authenticated, redirect them to the dashboard
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
}
