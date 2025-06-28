import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { useGroupManagement } from '../context/GroupManagementContext';
import { CheckoutModal } from './CheckoutModal';
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
  const { addNotification } = useNotifications();
  // SPECIFICATION FIX: Get edge case functions from context
  const { handleFullGroup, cancelGroup } = useGroupManagement();
  
  // Local state for interactive demo
  const [currentPledges, setCurrentPledges] = useState(product.spotsTotal - product.spotsLeft);
  const [status, setStatus] = useState<'active' | 'successful' | 'canceled' | 'soldout'>('active');
  const [transactionState, setTransactionState] = useState<'idle' | 'authorizing' | 'authorized' | 'charged' | 'refunded' | 'failed'>('idle');
  const [hasJoined, setHasJoined] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);

  const moq = product.spotsTotal;
  const progress = status === 'canceled' ? 0 : (currentPledges / moq) * 100;
  const isMet = currentPledges >= moq || isSoldOut;
  const isCanceled = status === 'canceled';
  const spotsLeft = isSoldOut ? 0 : Math.max(0, moq - currentPledges);

  const handleCardClick = () => {
    if (isLoggedIn) {
      navigate(`/product/${product.id}`);
    } else {
      navigate('/login', { state: { from: `/product/${product.id}` } });
    }
  };

  const handleJoinGroup = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }

    if (isMet || hasJoined || isCanceled || isSoldOut) return;

    // Open the checkout modal instead of immediately processing
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmCheckout = async () => {
    // Check for race condition before processing
    if (isSoldOut) {
      addNotification('Sorry! The last spot was just taken by another user.', 'error');
      setIsCheckoutModalOpen(false);
      return;
    }

    // Start transaction simulation
    setTransactionState('authorizing');
    addNotification('Authorizing payment...', 'info');

    try {
      // Simulate payment authorization delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTransactionState('authorized');
      addNotification('Payment authorized! Joining group...', 'info');
      
      // Update pledge count
      const newPledgeCount = currentPledges + 1;
      setCurrentPledges(newPledgeCount);
      setHasJoined(true);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if MOQ is met to charge payment
      if (newPledgeCount >= moq) {
        setStatus('successful');
        setTransactionState('charged');
        addNotification(`🎉 Group buy successful! Payment charged for ${product.title}`, 'success');
      } else {
        setTransactionState('authorized');
        addNotification(`✅ Successfully joined! Payment authorized for ${product.title}`, 'success');
      }

    } catch (error) {
      setTransactionState('failed');
      addNotification('Failed to join group. Please try again.', 'error');
    }
  };

  // SPECIFICATION FIX: Connect race condition demo to context function
  const handleRaceConditionDemo = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (isSoldOut || isCanceled) return;

    addNotification('Simulating another user taking the last spot...', 'info');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the context function to handle the race condition
      const result = handleFullGroup();
      
      // Fill the group to capacity
      setCurrentPledges(moq);
      setIsSoldOut(true);
      setStatus('soldout');
      
      console.log(`🏃‍♂️ RACE CONDITION: Last spot taken for ${product.title}`);
      console.log(`📊 FINAL STATUS: ${moq}/${moq} spots filled - Group is now full`);
      
      addNotification(`⚡ Race condition! Another user just took the last spot in "${product.title}"`, 'warning');
      
      // Show additional context
      setTimeout(() => {
        addNotification('💡 This demonstrates real-time inventory management in group buying platforms', 'info');
      }, 2000);
      
    } catch (error) {
      addNotification('Failed to simulate race condition.', 'error');
    }
  };

  // SPECIFICATION FIX: Connect farmer cancellation demo to context function
  const handleCancelListing = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (isCanceled) return;

    addNotification('Processing cancellation...', 'warning');
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use the context function to handle the cancellation
      const result = cancelGroup(product.id);
      
      console.log(`🚨 CRITICAL ACTION: Farmer has canceled listing for ${product.title}.`);
      console.log(`💰 TRANSACTION: Processing full refunds for all ${currentPledges} backers.`);
      
      setStatus('canceled');
      setTransactionState('refunded');
      setCurrentPledges(0); // Reset pledges to 0 for visual effect
      
      addNotification(`Listing canceled. ${hasJoined ? 'Your payment has been refunded.' : 'All participants will be refunded.'}`, 'error');
      
    } catch (error) {
      addNotification('Failed to cancel listing. Please try again.', 'error');
    }
  };

  const getStatusColor = () => {
    if (status === 'canceled') return 'bg-stone';
    if (status === 'successful' || isSoldOut) return 'bg-success';
    if (progress > 70) return 'bg-harvest-gold';
    if (progress > 40) return 'bg-info';
    return 'bg-stone/30';
  };

  const getStatusText = () => {
    if (status === 'canceled') return 'Canceled by Farmer - Refunds Processed';
    if (isSoldOut && !hasJoined) return 'Group Full - Last Spot Taken';
    if (hasJoined && isMet) return 'Group Complete - Payment Charged';
    if (hasJoined) return 'Joined - Payment Authorized';
    if (isMet || isSoldOut) return 'Group Full';
    return `${spotsLeft} spots left`;
  };

  const getButtonText = () => {
    if (status === 'canceled') return 'Listing Canceled';
    if (!isLoggedIn) return 'Sign In to Join';
    if (isSoldOut && !hasJoined) return 'Sold Out';
    if (hasJoined && isMet) return 'Successfully Completed!';
    if (hasJoined) return 'Joined Group!';
    if (isMet) return 'Group Full';
    return 'Join Group';
  };

  const getButtonStyle = () => {
    if (status === 'canceled') return 'bg-stone text-white cursor-not-allowed opacity-60';
    if (isSoldOut && !hasJoined) return 'bg-error text-white cursor-not-allowed';
    if (hasJoined && isMet) return 'bg-success text-white cursor-default';
    if (hasJoined) return 'bg-harvest-gold text-evergreen cursor-default';
    if (isMet) return 'bg-stone text-white cursor-not-allowed';
    if (!isLoggedIn) return 'bg-evergreen text-parchment hover:opacity-90';
    return 'bg-evergreen text-parchment hover:opacity-90 hover:scale-105';
  };

  const cardBorderStyle = () => {
    if (status === 'canceled') return 'border-stone opacity-60';
    if (isSoldOut && !hasJoined) return 'border-error';
    if (status === 'successful') return 'border-success';
    if (hasJoined) return 'border-harvest-gold';
    return 'border-stone/10';
  };

  return (
    <>
      <div 
        className="flex-shrink-0 w-[90vw] sm:w-[400px] group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className={`block bg-white border-2 rounded-xl shadow-sm p-4 flex flex-col hover:-translate-y-2 transition-all duration-300 h-full ${cardBorderStyle()} ${
          status === 'canceled' ? 'relative' : ''
        } ${isSoldOut && !hasJoined ? 'opacity-75' : ''}`}>
          
          {/* Canceled Overlay */}
          {status === 'canceled' && (
            <div className="absolute inset-0 bg-white/70 rounded-xl z-10 flex items-center justify-center">
              <div className="text-center">
                <i className="ph-bold ph-x-circle text-stone text-4xl mb-2"></i>
                <p className="font-bold text-stone">Listing Canceled</p>
                <p className="text-sm text-stone/80">Refunds Processed</p>
              </div>
            </div>
          )}

          {/* Sold Out Overlay */}
          {isSoldOut && !hasJoined && (
            <div className="absolute top-4 right-4 bg-error text-white px-3 py-1 rounded-full text-sm font-bold z-10">
              SOLD OUT
            </div>
          )}
          
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
              <span className={`${
                status === 'canceled' ? 'text-stone' :
                isMet || isSoldOut ? 'text-success' : 'text-info'
              }`}>
                {status === 'canceled' ? '0' : currentPledges} of {moq} joined
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
                status === 'canceled' ? 'text-stone' :
                isSoldOut && !hasJoined ? 'text-error' :
                isMet ? 'text-success' : 
                hasJoined ? 'text-harvest-gold' : 'text-charcoal'
              }`}>
                {getStatusText()}
              </span>
            </div>

            {/* Member Avatars */}
            {product.members && product.members.length > 0 && status !== 'canceled' && (
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
                {!isLoggedIn && status !== 'canceled' && !isSoldOut && (
                  <span className="text-sm font-semibold text-harvest-gold">
                    Sign In to Join →
                  </span>
                )}
              </div>

              {/* Join Button */}
              <button
                onClick={handleJoinGroup}
                disabled={transactionState === 'authorizing' || (hasJoined && isMet) || status === 'canceled' || (isSoldOut && !hasJoined)}
                className={`w-full h-12 flex items-center justify-center font-bold text-lg rounded-lg transition-all shadow-lg mb-2 ${getButtonStyle()}`}
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

              {/* SPECIFICATION FIX: Demo Buttons for Edge Cases */}
              <div className="space-y-1">
                {/* Race Condition Demo Button */}
                {status !== 'canceled' && !isSoldOut && spotsLeft > 0 && (
                  <button
                    onClick={handleRaceConditionDemo}
                    className="w-full h-10 flex items-center justify-center border border-harvest-gold/30 text-harvest-gold font-semibold text-sm rounded-lg hover:bg-harvest-gold/10 transition-colors"
                  >
                    <i className="ph-bold ph-lightning mr-2"></i>
                    (Demo) Take Last Spot
                  </button>
                )}

                {/* Farmer Cancel Button */}
                {status !== 'canceled' && !isSoldOut && (
                  <button
                    onClick={handleCancelListing}
                    className="w-full h-10 flex items-center justify-center border border-stone/30 text-stone font-semibold text-sm rounded-lg hover:bg-stone/10 transition-colors"
                  >
                    <i className="ph-bold ph-x mr-2"></i>
                    (Demo) Farmer Cancel Listing
                  </button>
                )}
              </div>

              {/* Transaction Status */}
              {transactionState !== 'idle' && (
                <div className="mt-2 text-center">
                  <span className={`text-xs font-semibold ${
                    transactionState === 'charged' ? 'text-success' :
                    transactionState === 'authorized' ? 'text-harvest-gold' :
                    transactionState === 'refunded' ? 'text-info' :
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

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleConfirmCheckout}
        product={product}
      />
    </>
  );
};