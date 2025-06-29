import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Rating {
  ratingId: string;
  orderId: string;
  farmerId: string;
  farmerName: string;
  customerId: string;
  customerName: string;
  productName: string;
  rating: number; // 1-5 stars
  comment: string;
  dateCreated: string;
  isVerified: boolean; // Whether the customer actually purchased the product
}

interface RatingContextType {
  ratings: Rating[];
  addRating: (orderId: string, farmerId: string, farmerName: string, productName: string, rating: number, comment: string) => void;
  getRatingsByFarmer: (farmerId: string) => Rating[];
  getAverageRating: (farmerId: string) => { average: number; count: number };
  hasUserRatedOrder: (orderId: string, customerId: string) => boolean;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const RatingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ratings, setRatings] = useState<Rating[]>([
    // Example initial data for demo
    {
      ratingId: 'rating-001',
      orderId: 'order-abc-001',
      farmerId: 'farmer01',
      farmerName: 'Sunrise Organics',
      customerId: 'user001',
      customerName: 'Alex Smith',
      productName: 'Organic Gala Apples - 2kg Bag',
      rating: 5,
      comment: 'Absolutely delicious apples! Crisp, sweet, and fresh. You can really taste the difference from store-bought.',
      dateCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: true
    },
    {
      ratingId: 'rating-002',
      orderId: 'order-def-002',
      farmerId: 'farmer01',
      farmerName: 'Sunrise Organics',
      customerId: 'user002',
      customerName: 'Maria Rodriguez',
      productName: 'Heirloom Tomatoes - 1kg',
      rating: 4,
      comment: 'Great variety of tomatoes with amazing flavor. Perfect for summer salads.',
      dateCreated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: true
    },
    {
      ratingId: 'rating-003',
      orderId: 'order-ghi-003',
      farmerId: 'farmer02',
      farmerName: 'Green Valley Produce',
      customerId: 'user003',
      customerName: 'David Chen',
      productName: 'Free-Range Eggs - Dozen',
      rating: 5,
      comment: 'Best eggs I\'ve ever had! Rich, golden yolks and you can tell these chickens are well cared for.',
      dateCreated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: true
    },
    {
      ratingId: 'rating-004',
      orderId: 'order-jkl-004',
      farmerId: 'farmer02',
      farmerName: 'Green Valley Produce',
      customerId: 'user004',
      customerName: 'Sarah Johnson',
      productName: 'Sourdough Bread - Large Loaf',
      rating: 5,
      comment: 'Incredible sourdough! Perfect crust and the most amazing flavor. Will definitely order again.',
      dateCreated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: true
    }
  ]);

  const addRating = (orderId: string, farmerId: string, farmerName: string, productName: string, rating: number, comment: string) => {
    const newRating: Rating = {
      ratingId: `rating-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      orderId,
      farmerId,
      farmerName,
      customerId: 'current-user', // In a real app, this would come from auth context
      customerName: 'Current User', // In a real app, this would come from auth context
      productName,
      rating,
      comment,
      dateCreated: new Date().toISOString(),
      isVerified: true
    };
    
    setRatings(prev => [newRating, ...prev]);
    
    console.log('⭐ NEW RATING SUBMITTED:', {
      ratingId: newRating.ratingId,
      farmer: farmerName,
      product: productName,
      rating: `${rating}/5 stars`,
      comment: comment || '(No comment)'
    });
  };

  const getRatingsByFarmer = (farmerId: string) => {
    return ratings.filter(rating => rating.farmerId === farmerId);
  };

  const getAverageRating = (farmerId: string) => {
    const farmerRatings = getRatingsByFarmer(farmerId);
    
    if (farmerRatings.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const total = farmerRatings.reduce((sum, rating) => sum + rating.rating, 0);
    const average = total / farmerRatings.length;
    
    return { average: Math.round(average * 10) / 10, count: farmerRatings.length };
  };

  const hasUserRatedOrder = (orderId: string, customerId: string) => {
    return ratings.some(rating => rating.orderId === orderId && rating.customerId === customerId);
  };

  return (
    <RatingContext.Provider value={{ 
      ratings, 
      addRating, 
      getRatingsByFarmer, 
      getAverageRating, 
      hasUserRatedOrder 
    }}>
      {children}
    </RatingContext.Provider>
  );
};

export const useRatings = () => {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error('useRatings must be used within a RatingProvider');
  }
  return context;
};