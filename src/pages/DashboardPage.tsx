import React, { useState } from 'react';
import { SupporterView } from './DashboardPage/SupporterView';
import { FarmerView } from './DashboardPage/FarmerView';
import { useAuth } from '../context/AuthContext';

type UserType = 'supporter' | 'farmer';
type SupporterSection = 'group-buys' | 'order-history' | 'profile';
type FarmerSection = 'listings' | 'sales' | 'farm-profile';

export const DashboardPage: React.FC = () => {
    const [userType, setUserType] = useState<UserType>('supporter');
    const [activeSupporterSection, setActiveSupporterSection] = useState<SupporterSection>('group-buys');
    const [activeFarmerSection, setActiveFarmerSection] = useState<FarmerSection>('listings');
    const { logout } = useAuth();

    const supporterNav = [
        { id: 'group-buys', icon: 'ph-users-three', label: 'My Group Buys' },
        { id: 'order-history', icon: 'ph-receipt', label: 'Order History' },
        { id: 'profile', icon: 'ph-user-circle', label: 'Profile' }
    ];

    const farmerNav = [
        { id: 'listings', icon: 'ph-storefront', label: 'My Listings' },
        { id: 'sales', icon: 'ph-chart-bar', label: 'Sales & Earnings' },
        { id: 'farm-profile', icon: 'ph-tractor', label: 'Farm Profile' }
    ];

    return (
        <main className="container mx-auto max-w-screen-xl px-md md:px-lg py-lg md:py-xl">
            <div className="mb-lg max-w-2xl mx-auto text-center">
                <h1 className="text-4xl lg:text-5xl font-lora">Your Dashboard</h1>
                <p className="text-lg text-charcoal/80 mt-2">Manage your group buys, orders, and profile information.</p>
                <div className="mt-md inline-block">
                    <label className="font-semibold text-charcoal mb-2 block text-center">Viewing as:</label>
                    <div className="user-type-toggle">
                        <button onClick={() => setUserType('supporter')} className={userType === 'supporter' ? 'active' : ''}>
                            <i className="ph ph-hand-heart"></i> Supporter
                        </button>
                        <button onClick={() => setUserType('farmer')} className={userType === 'farmer' ? 'active' : ''}>
                            <i className="ph ph-leaf"></i> Farmer
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-lg md:gap-xl">
                {/* Supporter View */}
                {userType === 'supporter' && (
                    <>
                        <nav className="md:col-span-1 lg:col-span-1 space-y-xs">
                            {supporterNav.map(item => (
                                <button key={item.id} onClick={() => setActiveSupporterSection(item.id as SupporterSection)} className={`dashboard-nav-link w-full ${activeSupporterSection === item.id ? 'active' : ''}`}>
                                    <i className={item.icon}></i> <span>{item.label}</span>
                                </button>
                            ))}
                             <button onClick={logout} className="dashboard-nav-link w-full text-error/80 hover:bg-error/10 hover:text-error !justify-start"><i className="ph ph-sign-out"></i><span>Sign Out</span></button>
                        </nav>
                        <div className="md:col-span-3 lg:col-span-4">
                            <SupporterView activeSection={activeSupporterSection} />
                        </div>
                    </>
                )}

                {/* Farmer View */}
                {userType === 'farmer' && (
                    <>
                        <nav className="md:col-span-1 lg:col-span-1 space-y-xs">
                            {farmerNav.map(item => (
                                <button key={item.id} onClick={() => setActiveFarmerSection(item.id as FarmerSection)} className={`dashboard-nav-link w-full ${activeFarmerSection === item.id ? 'active' : ''}`}>
                                    <i className={item.icon}></i> <span>{item.label}</span>
                                </button>
                            ))}
                            <button onClick={logout} className="dashboard-nav-link w-full text-error/80 hover:bg-error/10 hover:text-error !justify-start"><i className="ph ph-sign-out"></i><span>Sign Out</span></button>
                        </nav>
                        <div className="md:col-span-3 lg:col-span-4">
                            <FarmerView activeSection={activeFarmerSection} />
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};