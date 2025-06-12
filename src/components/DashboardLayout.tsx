import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { DashboardNavItem } from '../types';

export const DashboardLayout: React.FC = () => {
    const { logout, user } = useAuth();

    const supporterNav: DashboardNavItem[] = [
        { id: 'group-buys', icon: 'ph-users-three', label: 'My Group Buys', path: '/dashboard' },
        { id: 'order-history', icon: 'ph-receipt', label: 'Order History', path: '/dashboard/orders' },
        { id: 'profile', icon: 'ph-user-circle', label: 'Profile', path: '/dashboard/profile' }
    ];

    const farmerNav: DashboardNavItem[] = [
        { id: 'listings', icon: 'ph-storefront', label: 'My Listings', path: '/dashboard' },
        { id: 'sales', icon: 'ph-chart-bar', label: 'Sales & Earnings', path: '/dashboard/sales' },
        { id: 'farm-profile', icon: 'ph-tractor', label: 'Farm Profile', path: '/dashboard/farm-profile' }
    ];

    const hostNav: DashboardNavItem[] = [
        { id: 'manage-groups', icon: 'ph-house-line', label: 'Manage Groups', path: '/dashboard' },
        { id: 'earnings', icon: 'ph-coins', label: 'Host Earnings', path: '/dashboard/earnings' },
        { id: 'host-profile', icon: 'ph-user-circle-gear', label: 'Host Profile', path: '/dashboard/host-profile' }
    ];

    // For now, default to supporter navigation since we don't have role management yet
    // This will be enhanced when we add user profiles and role assignment
    const currentNav = supporterNav;

    // Get user display name from Supabase user metadata
    const getUserDisplayName = () => {
        if (user?.user_metadata?.full_name) {
            return user.user_metadata.full_name;
        }
        if (user?.email) {
            return user.email.split('@')[0]; // Use part before @ as fallback
        }
        return 'User';
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <main className="container mx-auto max-w-screen-xl px-md md:px-lg py-lg md:py-xl">
            <div className="mb-lg max-w-2xl mx-auto text-center">
                <h1 className="text-4xl lg:text-5xl font-lora">Welcome back, {getUserDisplayName()}!</h1>
                <p className="text-lg text-charcoal/80 mt-2">Manage your account and activities.</p>
                <div className="mt-md inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone/20">
                    <i className="ph-hand-heart text-harvest-gold text-xl"></i>
                    <span className="font-semibold text-charcoal">Supporter Dashboard</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-lg md:gap-xl">
                <nav className="md:col-span-1 lg:col-span-1 space-y-xs">
                    {currentNav.map(item => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => 
                                `dashboard-nav-link w-full ${isActive ? 'active' : ''}`
                            }
                        >
                            <i className={item.icon}></i> 
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                    <button 
                        onClick={handleLogout} 
                        className="dashboard-nav-link w-full text-error/80 hover:bg-error/10 hover:text-error !justify-start"
                    >
                        <i className="ph ph-sign-out"></i>
                        <span>Sign Out</span>
                    </button>
                </nav>
                
                <div className="md:col-span-3 lg:col-span-4">
                    <Outlet />
                </div>
            </div>
        </main>
    );
};