import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import type { ProductWithFarmer } from '../types';

interface InteractiveProductCardProps {
  product: ProductWithFarmer;
  isLoggedIn?: boolean;
}

export const InteractiveProductCard: React.FC<InteractiveProductCardProps> = ({ 
  product, 
  isLoggedIn = false 
}) => {
  const navigate = useNavigate();
  
  // Local state for interactive demo
  const [currentPledges, setCurrentPledges] = useState(product.spotsTotal - product.spotsLeft);
  const [transactionState, setTransactionState] = useState<'idle' | 'authorizing' | 'authorized' | 'charged' | 'failed'>('idle');
  const [hasJoined, setHasJoined] = useState(false);

  const moq = product.spotsTotal;
  const progress = (currentPledges / moq) * 100;
  const isMet = currentPledges >= moq;
  const spotsLeft = moq - currentPledges;

  const handleCardClick = () => {
    if (isLoggedIn) {
      navigate(`/product/${product.id}`);
    } else {
      navigate('/login');
    }
  };

  const handleJoinGroup = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (isMet || hasJoined) return;

    // Start transaction simulation
    setTransactionState('authorizing');
    toast.loading('Authorizing payment...', { id: 'join-group' });

    try {
      // Simulate payment authorization delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTransactionState('authorized');
      toast.loading('Payment authorized! Joining group...', { id: 'join-group' });
      
      // Update pledge count
      const newPledgeCount = currentPledges + 1;
      setCurrentPledges(newPledgeCount);
      setHasJoined(true);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if MOQ is met to charge payment
      if (newPledgeCount >= moq) {
        setTransactionState('charged');
        toast.success(`🎉 Group buy successful! Payment charged for ${product.title}`, { 
          id: 'join-group',
          duration: 4000 
        });
      } else {
        setTransactionState('authorized');
        toast.success(`✅ Successfully joined! Payment authorized for ${product.title}`, { 
          id: 'join-group',
          duration: 4000 
        });
      }

    } catch (error) {
      setTransactionState('failed');
      toast.error('Failed to join group. Please try again.', { id: 'join-group' });
    }
  };

  const getStatusColor = () => {
    if (isMet) return 'bg-success';
    if (progress > 70) return 'bg-harvest-gold';
    if (progress > 40) return 'bg-info';
    return 'bg-stone';
  };

  const getStatusText = () => {
    if (hasJoined && isMet) return 'Group Complete - Payment Charged';
    if (hasJoined) return 'Joined - Payment Authorized';
    if (isMet) return 'Group Full';
    return `${spotsLeft} spots left`;
  };

  const getButtonText = () => {
    if (!isLoggedIn) return 'Sign In to Join';
    if (hasJoined && isMet) return 'Successfully Completed!';
    if (hasJoined) return 'Joined Group!';
    if (isMet) return 'Group Full';
    return 'Join Group';
  };

  const getButtonStyle = () => {
    if (hasJoined && isMet) return 'bg-success text-white cursor-default';
    if (hasJoined) return 'bg-harvest-gold text-evergreen cursor-default';
    if (isMet) return 'bg-stone text-white cursor-not-allowed';
    if (!isLoggedIn) return 'bg-evergreen text-parchment hover:opacity-90';
    return 'bg-evergreen text-parchment hover:opacity-90 hover:scale-105';
  };

  return (
    <div 
      className="flex-shrink-0 w-[90vw] sm:w-[400px] group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className={`block bg-white border-2 rounded-xl shadow-sm p-4 flex flex-col hover:-translate-y-2 transition-all duration-300 h-full ${
        isMet ? 'border-success' : hasJoined ? 'border-harvest-gold' : 'border-stone/10'
      }`}>
        
        {/* Product Image with Badges */}
        <div className="overflow-hidden rounded-lg relative">
          <img
            width="800"
            height="600"
            loading="lazy"
            src={product.imageUrl}
            alt={product.title}
            className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Farmer Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <img
              width="40"
              height="40"
              className="w-10 h-10 rounded-full border-2 border-white shadow"
              src={product.farmer?.avatar || ''}
              alt={`${product.farmer?.name || 'Farmer'} Avatar`}
            />
            <span
              className="font-semibold text-white"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
            >
              {product.farmer?.name || 'Unknown Farmer'}
            </span>
          </div>

          {/* Verification Badge */}
          {product.farmer?.bio?.includes('Level') && (
            <div className="absolute top-3 right-3 bg-white/90 text-evergreen px-2 py-1 rounded-full text-xs font-bold">
              {product.farmer.bio.split(' - ')[0]}
            </div>
          )}

          {/* Waste-Warrior Badge */}
          {product.title.includes('Surplus') && (
            <div className="absolute bottom-3 left-3 bg-harvest-gold text-evergreen px-3 py-1 rounded-full text-sm font-bold">
              🌱 Waste-Warrior
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="mt-md flex-grow">
          <h3 className="text-2xl font-semibold">{product.title}</h3>
          <p className="text-lg text-charcoal/80">{product.weight}</p>
          <p className="mt-sm text-sm text-body line-clamp-2">
            {(product.description || '').split('\n')[0]}
          </p>
        </div>
        
        {/* Group Buy Progress */}
        <div className="mt-auto pt-md">
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <span className={`${isMet ? 'text-success' : 'text-info'}`}>
              {currentPledges} of {moq} joined
            </span>
            <span className="text-stone">{product.daysLeft} days left</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-stone/20 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getStatusColor()}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          
          {/* Status Text */}
          <div className="text-center mb-3">
            <span className={`text-sm font-semibold ${
              isMet ? 'text-success' : hasJoined ? 'text-harvest-gold' : 'text-charcoal'
            }`}>
              {getStatusText()}
            </span>
          </div>

          {/* Member Avatars */}
          {product.members && product.members.length > 0 && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center -space-x-2">
                {(product.members || []).slice(0, 3).map((member) => (
                  <img
                    key={member.id}
                    width="32"
                    height="32"
                    className="w-8 h-8 rounded-full border-2 border-white"
                    src={member.avatar}
                    alt={`${member.name} Avatar`}
                  />
                ))}
                {hasJoined && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-harvest-gold flex items-center justify-center">
                    <span className="text-xs font-bold text-evergreen">You</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing and CTA */}
          <div className="pt-md border-t border-stone/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-2xl font-bold text-evergreen">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm line-through text-stone ml-2">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {!isLoggedIn && (
                <span className="text-sm font-semibold text-harvest-gold">
                  Sign In to Join →
                </span>
              )}
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoinGroup}
              disabled={transactionState === 'authorizing' || (hasJoined && isMet)}
              className={`w-full h-12 flex items-center justify-center font-bold text-lg rounded-lg transition-all shadow-lg ${getButtonStyle()}`}
            >
              {transactionState === 'authorizing' ? (
                <>
                  <i className="ph ph-spinner animate-spin mr-2"></i>
                  Authorizing...
                </>
              ) : (
                getButtonText()
              )}
            </button>

            {/* Transaction Status */}
            {transactionState !== 'idle' && (
              <div className="mt-2 text-center">
                <span className={`text-xs font-semibold ${
                  transactionState === 'charged' ? 'text-success' :
                  transactionState === 'authorized' ? 'text-harvest-gold' :
                  transactionState === 'failed' ? 'text-error' : 'text-info'
                }`}>
                  Payment Status: {transactionState.charAt(0).toUpperCase() + transactionState.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};