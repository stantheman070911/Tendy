// src/components/DemoApp.jsx
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { CustomerDashboard } from './CustomerDashboard';
import { FarmerDashboard } from './FarmerDashboard';
import { HostDashboard } from './HostDashboard';
import { NotificationPanel } from './NotificationPanel';

export const DemoApp = () => {
  const { currentUser, login, logout, users } = useApp();
  const [activeView, setActiveView] = useState('customer');

  // Get demo users for quick login
  const demoUsers = Object.values(users);
  const customerUser = demoUsers.find(u => u.role === 'customer');
  const hostUser = demoUsers.find(u => u.role === 'host');
  const farmerUser = demoUsers.find(u => u.role === 'farmer' && u.verificationTier?.includes('Landmark'));

  const handleQuickLogin = (role) => {
    const user = demoUsers.find(u => u.role === role);
    if (user) {
      login(user.email);
      setActiveView(role);
    }
  };

  const renderView = () => {
    if (!currentUser) {
      return (
        <div className="min-h-screen bg-parchment flex items-center justify-center">
          <div className="bg-white rounded-xl p-xl shadow-lg max-w-md w-full mx-md">
            <h2 className="text-3xl font-lora text-evergreen text-center mb-lg">
              Tendy Demo Login
            </h2>
            <p className="text-charcoal/80 text-center mb-lg">
              Choose a role to experience the platform from different perspectives
            </p>
            
            <div className="space-y-md">
              <button
                onClick={() => handleQuickLogin('customer')}
                className="w-full h-14 flex items-center justify-center gap-3 bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
              >
                <i className="ph-bold ph-shopping-cart text-xl"></i>
                Login as Customer
              </button>
              
              <button
                onClick={() => handleQuickLogin('host')}
                className="w-full h-14 flex items-center justify-center gap-3 bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:scale-105 transition-transform"
              >
                <i className="ph-bold ph-house-line text-xl"></i>
                Login as Host
              </button>
              
              <button
                onClick={() => handleQuickLogin('farmer')}
                className="w-full h-14 flex items-center justify-center gap-3 border-2 border-evergreen text-evergreen font-bold text-lg rounded-lg hover:bg-evergreen hover:text-parchment transition-colors"
              >
                <i className="ph-bold ph-plant text-xl"></i>
                Login as Farmer
              </button>
            </div>
            
            <div className="mt-lg pt-lg border-t border-stone/20 text-center">
              <p className="text-sm text-stone">
                This is a fully interactive demo with real-time data updates
              </p>
            </div>
          </div>
        </div>
      );
    }

    switch (currentUser.role) {
      case 'farmer':
        return <FarmerDashboard farmer={currentUser} />;
      case 'host':
        return <HostDashboard host={currentUser} />;
      case 'customer':
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-parchment">
      {/* Demo Header */}
      {currentUser && (
        <header className="bg-evergreen text-parchment shadow-lg sticky top-0 z-50">
          <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-lora font-bold">Tendy</h1>
                <span className="text-sm bg-harvest-gold text-evergreen px-2 py-1 rounded-full font-semibold">
                  DEMO
                </span>
              </div>

              {/* User Info & Logout */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border-2 border-harvest-gold"
                  />
                  <div>
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-sm text-parchment/80 capitalize">{currentUser.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="h-10 px-4 bg-parchment/20 text-parchment font-semibold rounded-lg hover:bg-parchment/30 transition-colors"
                >
                  <i className="ph-bold ph-sign-out mr-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="min-h-screen">
        {renderView()}
      </main>

      {/* Notification Panel */}
      <NotificationPanel />

      {/* Demo Instructions Footer */}
      {currentUser && (
        <footer className="bg-evergreen text-parchment py-xl mt-xl">
          <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
            <div className="text-center">
              <h3 className="text-2xl font-lora mb-md">🎯 Interactive Demo Features</h3>
              <div className="grid md:grid-cols-3 gap-lg text-sm">
                <div className="bg-evergreen/50 rounded-lg p-md">
                  <h4 className="font-bold mb-2 text-harvest-gold">Real-Time Updates</h4>
                  <p>Join groups, create subscriptions, and see data change instantly across the platform.</p>
                </div>
                <div className="bg-evergreen/50 rounded-lg p-md">
                  <h4 className="font-bold mb-2 text-harvest-gold">Edge Case Simulation</h4>
                  <p>Experience race conditions, farmer cancellations, and payment authorization flows.</p>
                </div>
                <div className="bg-evergreen/50 rounded-lg p-md">
                  <h4 className="font-bold mb-2 text-harvest-gold">Multi-Role Experience</h4>
                  <p>Switch between customer, farmer, and host perspectives to see the complete ecosystem.</p>
                </div>
              </div>
              <p className="mt-lg text-parchment/80">
                All data updates happen in real-time. Try joining groups, creating subscriptions, and exploring different user roles!
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};