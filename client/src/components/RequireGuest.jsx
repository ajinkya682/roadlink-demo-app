import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppData } from '../context/AppContext';

export default function RequireGuest({ children }) {
  const { isAuthenticated } = useAppData();
  const location = useLocation();

  if (isAuthenticated) {
    // If the user is already authenticated, redirect them to the dashboard
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
}
