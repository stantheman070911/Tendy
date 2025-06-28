import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardProvider } from './context/DashboardContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <DashboardProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </DashboardProvider>
    </NotificationProvider>
  </StrictMode>
);