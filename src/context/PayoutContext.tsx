import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Payout {
  payoutId: string;
  orderId: string;
  farmerId: string;
  farmerName: string;
  productName: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  dateInitiated: string;
  dateCompleted?: string;
  transactionId?: string;
}

interface PayoutContextType {
  payouts: Payout[];
  addPayout: (orderId: string, farmerId: string, farmerName: string, productName: string, amount: number) => void;
  updatePayoutStatus: (payoutId: string, status: Payout['status'], transactionId?: string) => void;
  getPayoutsByFarmer: (farmerId: string) => Payout[];
  getTotalEarnings: (farmerId: string) => { total: number; pending: number; completed: number };
}

const PayoutContext = createContext<PayoutContextType | undefined>(undefined);

export const PayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payouts, setPayouts] = useState<Payout[]>([
    // Example initial data for demo
    { 
      payoutId: 'payout-101', 
      orderId: 'order-abc-001', 
      farmerId: 'farmer01', 
      farmerName: 'Sunrise Organics',
      productName: 'Organic Gala Apples - 2kg Bag',
      amount: 156.40, 
      status: 'Completed', 
      dateInitiated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dateCompleted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      transactionId: 'txn_abc123'
    },
    { 
      payoutId: 'payout-102', 
      orderId: 'order-def-002', 
      farmerId: 'farmer01', 
      farmerName: 'Sunrise Organics',
      productName: 'Heirloom Tomatoes - 1kg',
      amount: 164.40, 
      status: 'Processing', 
      dateInitiated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    { 
      payoutId: 'payout-103', 
      orderId: 'order-ghi-003', 
      farmerId: 'farmer02', 
      farmerName: 'Green Valley Produce',
      productName: 'Free-Range Eggs - Dozen',
      amount: 193.20, 
      status: 'Pending', 
      dateInitiated: new Date().toISOString()
    }
  ]);

  const addPayout = (orderId: string, farmerId: string, farmerName: string, productName: string, amount: number) => {
    const newPayout: Payout = {
      payoutId: `payout-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      orderId,
      farmerId,
      farmerName,
      productName,
      amount,
      status: 'Pending',
      dateInitiated: new Date().toISOString(),
    };
    
    setPayouts(prev => [newPayout, ...prev]);
    
    // Simulate automatic processing
    setTimeout(() => {
      updatePayoutStatus(newPayout.payoutId, 'Processing');
    }, 2000);
    
    setTimeout(() => {
      updatePayoutStatus(newPayout.payoutId, 'Completed', `txn_${Math.random().toString(36).substr(2, 8)}`);
    }, 5000);
    
    console.log('💰 NEW PAYOUT CREATED:', {
      payoutId: newPayout.payoutId,
      farmer: farmerName,
      amount: `$${amount.toFixed(2)}`,
      product: productName
    });
  };

  const updatePayoutStatus = (payoutId: string, status: Payout['status'], transactionId?: string) => {
    setPayouts(prev => prev.map(payout => {
      if (payout.payoutId === payoutId) {
        const updatedPayout = {
          ...payout,
          status,
          ...(transactionId && { transactionId }),
          ...(status === 'Completed' && { dateCompleted: new Date().toISOString() })
        };
        
        console.log(`💰 PAYOUT STATUS UPDATED: ${payoutId} → ${status}`, {
          farmer: payout.farmerName,
          amount: `$${payout.amount.toFixed(2)}`,
          ...(transactionId && { transactionId })
        });
        
        return updatedPayout;
      }
      return payout;
    }));
  };

  const getPayoutsByFarmer = (farmerId: string) => {
    return payouts.filter(payout => payout.farmerId === farmerId);
  };

  const getTotalEarnings = (farmerId: string) => {
    const farmerPayouts = getPayoutsByFarmer(farmerId);
    
    const total = farmerPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    const pending = farmerPayouts
      .filter(payout => payout.status === 'Pending' || payout.status === 'Processing')
      .reduce((sum, payout) => sum + payout.amount, 0);
    const completed = farmerPayouts
      .filter(payout => payout.status === 'Completed')
      .reduce((sum, payout) => sum + payout.amount, 0);
    
    return { total, pending, completed };
  };

  return (
    <PayoutContext.Provider value={{ 
      payouts, 
      addPayout, 
      updatePayoutStatus, 
      getPayoutsByFarmer, 
      getTotalEarnings 
    }}>
      {children}
    </PayoutContext.Provider>
  );
};

export const usePayouts = () => {
  const context = useContext(PayoutContext);
  if (context === undefined) {
    throw new Error('usePayouts must be used within a PayoutProvider');
  }
  return context;
};