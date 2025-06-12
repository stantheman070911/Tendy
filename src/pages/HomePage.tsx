import React from 'react';
import { Hero } from '../components/Hero';
import { CommunityStats } from '../components/CommunityStats';
import { LiveGroupBuys } from '../components/LiveGroupBuys';
import { HowItWorks } from '../components/HowItWorks';
import { FarmerOfTheWeek } from '../components/FarmerOfTheWeek';
import { GroupTypes } from '../components/GroupTypes';
import { ForFarmers } from '../components/ForFarmers';
import { ForHosts } from '../components/ForHosts';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <main>
      <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
        <Hero />
      </div>
      
      <CommunityStats />
      
      <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
        <LiveGroupBuys isLoggedIn={isLoggedIn} />
        <HowItWorks />
        <FarmerOfTheWeek />
        <GroupTypes />
      </div>
      
      <ForFarmers />
      
      <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
        <ForHosts />
      </div>
    </main>
  );
};