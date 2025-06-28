import React, { useState } from 'react';
import { CustomerDashboard } from './CustomerDashboard';
import { FarmerDashboard } from './FarmerDashboard';
import { HostDashboard } from './HostDashboard';
import { NotificationProvider } from '../context/NotificationContext';
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '../context/AuthContext';

// Import our placeholder data
const users = [
  {
    userId: "user001",
    role: "Customer",
    name: "Alex Smith",
    email: "alex.smith@example.com",
    joinDate: "2024-08-15"
  },
  {
    userId: "host01",
    role: "Verified Host",
    name: "Charles Green",
    email: "charles.green@example.com",
    joinDate: "2024-07-20",
    verificationStatus: "Completed",
    groupsManaged: ["group01"]
  },
  {
    userId: "farmer01",
    role: "Farmer",
    farmName: "Sunrise Organics",
    name: "Diana Prince",
    verificationTier: "Level 1: Tendy Sprout",
    businessLicenseVerified: true,
    products: ["prod01", "prod02"]
  },
  {
    userId: "farmer02",
    role: "Farmer",
    farmName: "Green Valley Produce",
    name: "Edward Kent",
    verificationTier: "Level 2: Tendy Verified Harvest",
    businessLicenseVerified: true,
    manualReviewCompleted: true,
    averageRating: 4.8,
    products: ["prod03", "prod04"]
  },
  {
    userId: "farmer03",
    role: "Farmer",
    farmName: "Landmark Heritage Farm",
    name: "Fiona Glenanne",
    verificationTier: "Level 3: Tendy Landmark Farm",
    businessLicenseVerified: true,
    manualReviewCompleted: true,
    virtualTourCompleted: true,
    averageRating: 4.9,
    products: ["prod05", "prod06"]
  }
];

type ViewType = 'customer' | 'farmer' | 'host';

export const DemoApp: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('customer');
  const { isLoggedIn } = useAuth();

  // Find our specific users from the placeholder data for the demo
  const farmerUser = users.find(u => u.role === 'Farmer' && u.verificationTier.includes('Landmark'));
  const hostUser = users.find(u => u.role === 'Verified Host');
  const customerUser = users.find(u => u.role === 'Customer');

  const getCurrentUser = () => {
    switch (activeView) {
      case 'farmer':
        return farmerUser;
      case 'host':
        return hostUser;
      case 'customer':
      default:
        return customerUser;
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'farmer':
        return <FarmerDashboard farmer={farmerUser} />;
      case 'host':
        return <HostDashboard host={hostUser} />;
      case 'customer':
      default:
        return <CustomerDashboard />;
    }
  };

  const getViewDescription = () => {
    switch (activeView) {
      case 'farmer':
        return 'Manage your farm listings, track sales, and connect with customers';
      case 'host':
        return 'Host group buys in your neighborhood and earn rewards';
      case 'customer':
      default:
        return 'Discover fresh, local produce and create private groups with friends';
    }
  };

  const getViewIcon = () => {
    switch (activeView) {
      case 'farmer':
        return 'ph-plant';
      case 'host':
        return 'ph-house-line';
      case 'customer':
      default:
        return 'ph-shopping-cart';
    }
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-parchment">
        {/* Demo Navigation Header */}
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

              {/* User Role Navigation */}
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('customer')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeView === 'customer'
                      ? 'bg-parchment text-evergreen'
                      : 'text-parchment hover:bg-evergreen/80'
                  }`}
                >
                  <i className="ph-bold ph-shopping-cart text-lg"></i>
                  Customer
                </button>
                <button
                  onClick={() => setActiveView('farmer')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeView === 'farmer'
                      ? 'bg-parchment text-evergreen'
                      : 'text-parchment hover:bg-evergreen/80'
                  }`}
                >
                  <i className="ph-bold ph-plant text-lg"></i>
                  Farmer
                </button>
                <button
                  onClick={() => setActiveView('host')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeView === 'host'
                      ? 'bg-parchment text-evergreen'
                      : 'text-parchment hover:bg-evergreen/80'
                  }`}
                >
                  <i className="ph-bold ph-house-line text-lg"></i>
                  Host
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Current View Header */}
        <div className="bg-white border-b border-stone/10">
          <div className="container mx-auto max-w-screen-xl px-md md:px-lg py-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-harvest-gold/10 rounded-full flex items-center justify-center`}>
                  <i className={`${getViewIcon()} text-harvest-gold text-3xl`}></i>
                </div>
                <div>
                  <h2 className="text-3xl font-lora text-evergreen">
                    {activeView === 'customer' ? 'Customer Dashboard' : 
                     activeView === 'farmer' ? `${farmerUser?.farmName}` : 
                     `Host Dashboard`}
                  </h2>
                  <p className="text-charcoal/80 mt-1">{getViewDescription()}</p>
                  {getCurrentUser() && (
                    <p className="text-sm text-stone mt-1">
                      Viewing as: <strong>{getCurrentUser()?.name}</strong>
                      {activeView === 'farmer' && (
                        <span className="ml-2 text-harvest-gold font-semibold">
                          {farmerUser?.verificationTier}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="min-h-screen">
          {renderView()}
        </main>

        {/* Notification Panel */}
        <NotificationPanel />

        {/* Demo Instructions Footer */}
        <footer className="bg-evergreen text-parchment py-xl mt-xl">
          <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
            <div className="text-center">
              <h3 className="text-2xl font-lora mb-md">🎯 Hackathon Demo Instructions</h3>
              <div className="grid md:grid-cols-3 gap-lg text-sm">
                <div className="bg-evergreen/50 rounded-lg p-md">
                  <h4 className="font-bold mb-2 text-harvest-gold">👥 Customer Experience</h4>
                  <ul className="space-y-1 text-left">
                    <li>• Create private groups with friends</li>
                    <li>• Join public group buys</li>
                    <li>• Experience payment authorization flow</li>
                    <li>• See community member participation</li>
                    <li>• Watch real-time notifications</li>
                  </ul>
                </div>
                <div className="bg-evergreen/50 rounded-lg p-md">
                  <h4 className="font-bold mb-2 text-harvest-gold">🌱 Farmer Dashboard</h4>
                  <ul className="space-y-1 text-left">
                    <li>• View verification tier system</li>
                    <li>• Manage product listings</li>
                    <li>• Track sales and earnings</li>
                    <li>• See different farmer levels</li>
                    <li>• Cancel listings (with refunds)</li>
                  </ul>
                </div>
                <div className="bg-evergreen/50 rounded-lg p-md">
                  <h4 className="font-bold mb-2 text-harvest-gold">🏠 Host Rewards</h4>
                  <ul className="space-y-1 text-left">
                    <li>• Manage neighborhood groups</li>
                    <li>• View reward wallet earnings</li>
                    <li>• Use Community Boost feature</li>
                    <li>• Track hosting statistics</li>
                    <li>• See notification system in action</li>
                  </ul>
                </div>
              </div>
              <p className="mt-lg text-parchment/80">
                Switch between user roles using the navigation above to experience the complete platform ecosystem.
                <br />
                <strong>Notice the real-time notifications</strong> that appear in the bottom-right corner!
              </p>
            </div>
          </div>
        </footer>
      </div>
    </NotificationProvider>
  );
};