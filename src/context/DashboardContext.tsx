import React, { createContext, useState, useContext, ReactNode } from 'react';

// This is the shape of your placeholder payout data
interface Payout {
  id: string;
  groupName: string;
  date: string;
  amount: number;
  status: 'pending' | 'processed' | 'completed';
}

interface DashboardContextType {
  recentPayouts: Payout[];
  triggerPayout: (group: { id: string, name: string, payout: number }) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Example initial data
  const [recentPayouts, setRecentPayouts] = useState<Payout[]>([
    { 
      id: 'payout01', 
      groupName: "Downtown Guava Lovers", 
      date: "2024-07-28", 
      amount: 276.00,
      status: 'completed'
    }
  ]);

  const triggerPayout = (group: { id: string, name: string, payout: number }) => {
    const newPayout: Payout = {
      id: `payout-${group.id}-${Date.now()}`, // unique ID
      groupName: group.name,
      date: new Date().toISOString().split('T')[0], // today's date
      amount: group.payout,
      status: 'pending'
    };
    
    // Add the new payout to the top of the list
    setRecentPayouts(prevPayouts => [newPayout, ...prevPayouts]);
    
    // Simulate processing: pending -> processed -> completed
    setTimeout(() => {
      setRecentPayouts(prev => prev.map(p => 
        p.id === newPayout.id ? { ...p, status: 'processed' } : p
      ));
    }, 2000);
    
    setTimeout(() => {
      setRecentPayouts(prev => prev.map(p => 
        p.id === newPayout.id ? { ...p, status: 'completed' } : p
      ));
    }, 4000);
  };

  return (
    <DashboardContext.Provider value={{ recentPayouts, triggerPayout }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};