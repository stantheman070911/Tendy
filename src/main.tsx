import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardProvider } from './context/DashboardContext';
import { GroupManagementProvider } from './context/GroupManagementContext';
import { DisputeProvider } from './context/DisputeContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <DashboardProvider>
        <GroupManagementProvider>
          <DisputeProvider>
            <SubscriptionProvider>
              <AuthProvider>
                <RouterProvider router={router} />
              </AuthProvider>
            </SubscriptionProvider>
          </DisputeProvider>
        </GroupManagementProvider>
      </DashboardProvider>
    </NotificationProvider>
  </StrictMode>
);