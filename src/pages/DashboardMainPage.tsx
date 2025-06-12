import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SupporterView } from './DashboardPage/SupporterView';
import { FarmerView } from './DashboardPage/FarmerView';
import { HostView } from './DashboardPage/HostView';

export const DashboardMainPage: React.FC = () => {
    const { user } = useAuth();

    // Render the appropriate view based on the user's role
    switch (user?.role) {
        case 'host':
            return <HostView activeSection="manage-groups" />;
        case 'farmer':
            return <FarmerView activeSection="listings" />;
        case 'supporter':
        default:
            return <SupporterView activeSection="group-buys" />;
    }
};