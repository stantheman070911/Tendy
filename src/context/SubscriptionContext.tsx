import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Subscription {
  id: string;
  productName: string;
  farmerName: string;
  price: number;
  deliveryFrequency: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  nextDelivery: string;
  status: 'Active' | 'Paused' | 'Canceled';
  startDate: string;
  imageUrl: string;
  totalDeliveries: number;
  remainingDeliveries?: number; // For fixed-term subscriptions
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id' | 'status' | 'startDate' | 'totalDeliveries'>) => void;
  pauseSubscription: (subscriptionId: string) => void;
  resumeSubscription: (subscriptionId: string) => void;
  cancelSubscription: (subscriptionId: string) => void;
  updateDeliveryFrequency: (subscriptionId: string, frequency: Subscription['deliveryFrequency']) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Demo subscriptions to show the system in action
const initialSubscriptions: Subscription[] = [
  { 
    id: 'sub-001', 
    productName: 'Organic Heirloom Tomatoes - 1kg', 
    farmerName: 'Rodriguez Farms',
    price: 6.00,
    deliveryFrequency: 'Weekly',
    nextDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    status: 'Active',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    imageUrl: 'https://images.unsplash.com/photo-1588650364232-38997a78336b?q=80&w=2940&auto=format&fit=crop',
    totalDeliveries: 3,
    remainingDeliveries: 9 // 12-week subscription
  },
  { 
    id: 'sub-002', 
    productName: 'Free-Range Eggs - Dozen', 
    farmerName: 'Green Valley Produce',
    price: 5.25,
    deliveryFrequency: 'Bi-Weekly',
    nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    status: 'Active',
    startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 4 weeks ago
    imageUrl: 'https://images.unsplash.com/photo-1587486913049-52fc082a934b?q=80&w=2894&auto=format&fit=crop',
    totalDeliveries: 2
  }
];

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);

  const addSubscription = (newSub: Omit<Subscription, 'id' | 'status' | 'startDate' | 'totalDeliveries'>) => {
    // Check for duplicate subscriptions
    const existingSubscription = subscriptions.find(s => 
      s.productName === newSub.productName && 
      s.farmerName === newSub.farmerName && 
      s.status === 'Active'
    );

    if (existingSubscription) {
      console.log('⚠️ SUBSCRIPTION CONFLICT: User already has active subscription for this product');
      return { success: false, message: 'You already have an active subscription for this product.' };
    }

    // Calculate next delivery date based on frequency
    const getNextDeliveryDate = (frequency: Subscription['deliveryFrequency']) => {
      const now = new Date();
      switch (frequency) {
        case 'Weekly':
          return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        case 'Bi-Weekly':
          return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        case 'Monthly':
          return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }
    };

    const subscription: Subscription = {
      ...newSub,
      id: `sub-${Date.now()}`,
      status: 'Active',
      startDate: new Date().toISOString(),
      nextDelivery: getNextDeliveryDate(newSub.deliveryFrequency).toISOString(),
      totalDeliveries: 0
    };

    setSubscriptions(prev => [subscription, ...prev]);
    
    console.log('🔄 NEW SUBSCRIPTION CREATED:', {
      subscriptionId: subscription.id,
      product: subscription.productName,
      farmer: subscription.farmerName,
      frequency: subscription.deliveryFrequency,
      nextDelivery: subscription.nextDelivery
    });

    return { success: true, subscription };
  };

  const pauseSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => 
      prev.map(s => s.id === subscriptionId ? { ...s, status: 'Paused' } : s)
    );
    console.log(`⏸️ SUBSCRIPTION PAUSED: ${subscriptionId}`);
  };

  const resumeSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => 
      prev.map(s => s.id === subscriptionId ? { ...s, status: 'Active' } : s)
    );
    console.log(`▶️ SUBSCRIPTION RESUMED: ${subscriptionId}`);
  };

  const cancelSubscription = (subscriptionId: string) => {
    setSubscriptions(prev => 
      prev.map(s => s.id === subscriptionId ? { ...s, status: 'Canceled' } : s)
    );
    console.log(`❌ SUBSCRIPTION CANCELED: ${subscriptionId}`);
  };

  const updateDeliveryFrequency = (subscriptionId: string, frequency: Subscription['deliveryFrequency']) => {
    setSubscriptions(prev => 
      prev.map(s => {
        if (s.id === subscriptionId) {
          // Recalculate next delivery based on new frequency
          const now = new Date();
          let nextDelivery: Date;
          
          switch (frequency) {
            case 'Weekly':
              nextDelivery = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              break;
            case 'Bi-Weekly':
              nextDelivery = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
              break;
            case 'Monthly':
              nextDelivery = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
              break;
          }

          return {
            ...s,
            deliveryFrequency: frequency,
            nextDelivery: nextDelivery.toISOString()
          };
        }
        return s;
      })
    );
    console.log(`🔄 SUBSCRIPTION FREQUENCY UPDATED: ${subscriptionId} → ${frequency}`);
  };

  return (
    <SubscriptionContext.Provider value={{ 
      subscriptions, 
      addSubscription, 
      pauseSubscription, 
      resumeSubscription, 
      cancelSubscription, 
      updateDeliveryFrequency 
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};