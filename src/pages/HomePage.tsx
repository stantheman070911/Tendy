import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { CommunityStats } from '../components/CommunityStats';
import { LiveGroupBuys } from '../components/LiveGroupBuys';
import { HowItWorks } from '../components/HowItWorks';
import { FarmerOfTheWeek } from '../components/FarmerOfTheWeek';
import { GroupTypes } from '../components/GroupTypes';
import { ForFarmers } from '../components/ForFarmers';
import { ForHosts } from '../components/ForHosts';
import { HostLeaderboard } from '../components/HostLeaderboard';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <main>
      {/* Demo Banner */}
      <div className="bg-harvest-gold text-evergreen py-3">
        <div className="container mx-auto max-w-screen-xl px-md md:px-lg text-center">
          <p className="font-semibold">
            🎯 <strong>Hackathon Demo:</strong> Experience the complete platform with interactive features! 
            <Link 
              to="/demo" 
              className="ml-2 underline hover:no-underline font-bold"
            >
              Try Interactive Demo →
            </Link>
          </p>
        </div>
      </div>

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
        
        {/* Host Leaderboard Section */}
        <section className="py-xl md:py-2xl">
          <HostLeaderboard limit={5} />
        </section>
      </div>
    </main>
  );
};