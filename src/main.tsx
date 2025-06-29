import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardProvider } from './context/DashboardContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { GroupManagementProvider } from './context/GroupManagementContext';
import { DisputeProvider } from './context/DisputeContext';
import { PayoutProvider } from './context/PayoutContext';
import { RatingProvider } from './context/RatingContext';
import { PlaceholderAuthProvider } from './context/PlaceholderAuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlaceholderAuthProvider>
      <NotificationProvider>
        <DashboardProvider>
          <SubscriptionProvider>
            <GroupManagementProvider>
              <DisputeProvider>
                <PayoutProvider>
                  <RatingProvider>
                    <AuthProvider>
                      <RouterProvider router={router} />
                    </AuthProvider>
                  </RatingProvider>
                </PayoutProvider>
              </DisputeProvider>
            </GroupManagementProvider>
          </SubscriptionProvider>
        </DashboardProvider>
      </NotificationProvider>
    </PlaceholderAuthProvider>
  </StrictMode>
);