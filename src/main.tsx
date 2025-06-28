import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardProvider } from './context/DashboardContext';
import { GroupManagementProvider } from './context/GroupManagementContext';
import { DisputeProvider } from './context/DisputeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider>
      <DashboardProvider>
        <GroupManagementProvider>
          <DisputeProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </DisputeProvider>
        </GroupManagementProvider>
      </DashboardProvider>
    </NotificationProvider>
  </React.StrictMode>
);