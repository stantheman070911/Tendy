import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePlaceholderAuth } from '../context/PlaceholderAuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = usePlaceholderAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Pass the original location in the state object so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};