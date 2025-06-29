import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './Header';
import { Footer } from './Footer';
import { NotificationPanel } from './NotificationPanel';
import { usePlaceholderAuth } from '../context/PlaceholderAuthContext';

export const Layout: React.FC = () => {
  const { isLoggedIn } = usePlaceholderAuth();

  return (
    <div className="bg-parchment font-inter text-charcoal">
      <Header isLoggedIn={isLoggedIn} />
      <Outlet /> 
      <Footer />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#EAAA00',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Notification Panel */}
      <NotificationPanel />
    </div>
  );
};