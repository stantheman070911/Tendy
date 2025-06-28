// src/components/InteractiveProductCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { CheckoutModal } from './CheckoutModal';

export const InteractiveProductCard = ({ product, isLoggedIn = false }) => {
  const navigate = useNavigate();
  const { 
    joinGroup, 
    simulateRaceCondition, 
    cancelGroupByFarmer, 
    currentUser,
    groups 
  } = useApp();
  
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Find the group for this product
  const group = Object.values(groups).find(g => g.productId === product.id);
  
  // Calculate current state
  const currentOrders = group?.currentOrders || 0;
  const moq = group?.moq || product.spotsTotal;
  const progress = (currentOrders / moq) * 100;
  const spotsLeft = Math.max(0, moq - currentOrders);
  const isFull = currentOrders >= moq;
  const isCanceled = group?.status === 'Canceled';
  const hasJoined = group?.members?.includes(currentUser?.id) || false;

  const handleCardClick = () => {
    if (isLoggedIn) {
      navigate(`/product/${product.id}`);
    } else {
      navigate('/login');
    }
  };

  const handleJoinGroup = async (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (isFull || hasJoined || isCanceled) return;

    setIsCheckoutModalOpen(true);
  };

  const handleConfirmCheckout = () => {
    if (group) {
      joinGroup(group.id);
    }
    setIsCheckoutModalOpen(false);
  };

  const handleRaceConditionDemo = (e) => {
    e.stopPropagation();
    if (group && !isFull && !isCanceled) {
      simulateRaceCondition(group.id);
    }
  };

  const handleCancelDemo = (e) => {
    e.stopPropagation();
    if (group && !isCanceled) {
      cancelGroupByFarmer(group.id);
    }
  };

  const getStatusColor = () => {
    if (isCanceled) return 'bg-stone';
    if (isFull) return 'bg-success';
    if (progress > 70) return 'bg-harvest-gold';
    if (progress > 40) return 'bg-info';
    return 'bg-stone/30';
  };

  const getStatusText = () => {
    if (isCanceled) return 'Canceled by Farmer';
    if (hasJoined && isFull) return 'Group Complete - Payment Charged';
    if (hasJoined) return 'Joined - Payment Authorized';
    if (isFull) return 'Group Full';
    return `${spotsLeft} spots left`;
  };

  const getButtonText = () => {
    if (isCanceled) return 'Listing Canceled';
    if (!isLoggedIn) return 'Sign In to Join';
    if (hasJoined && isFull) return 'Successfully Completed!';
    if (hasJoined) return 'Joined Group!';
    if (isFull) return 'Group Full';
    return 'Join Group';
  };

  const getButtonStyle = () => {
    if (isCanceled) return 'bg-stone text-white cursor-not-allowed opacity-60';
    if (hasJoined && isFull) return 'bg-success text-white cursor-default';
    if (hasJoined) return 'bg-harvest-gold text-evergreen cursor-default';
    if (isFull) return 'bg-stone text-white cursor-not-allowed';
    if (!isLoggedIn) return 'bg-evergreen text-parchment hover:opacity-90';
    return 'bg-evergreen text-parchment hover:opacity-90 hover:scale-105';
  };

  const cardBorderStyle = () => {
    if (isCanceled) return 'border-stone opacity-60';
    if (isFull) return 'border-success';
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
          isCanceled ? 'relative' : ''
        }`}>
          
          {/* Canceled Overlay */}
          {isCanceled && (
            <div className="absolute inset-0 bg-white/70 rounded-xl z-10 flex items-center justify-center">
              <div className="text-center">
                <i className="ph-bold ph-x-circle text-stone text-4xl mb-2"></i>
                <p className="font-bold text-stone">Listing Canceled</p>
                <p className="text-sm text-stone/80">Refunds Processed</p>
              </div>
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

            {/* Waste-Warrior Badge */}
            {product.isWasteWarrior && (
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
              {product.description}
            </p>
          </div>
          
          {/* Group Buy Progress */}
          <div className="mt-auto pt-md">
            <div className="flex justify-between items-center text-sm font-semibold mb-2">
              <span className={`${
                isCanceled ? 'text-stone' :
                isFull ? 'text-success' : 'text-info'
              }`}>
                {isCanceled ? '0' : currentOrders} of {moq} joined
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
                isCanceled ? 'text-stone' :
                isFull ? 'text-success' : 
                hasJoined ? 'text-harvest-gold' : 'text-charcoal'
              }`}>
                {getStatusText()}
              </span>
            </div>

            {/* Member Avatars */}
            {product.members && product.members.length > 0 && !isCanceled && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center -space-x-2">
                  {product.members.slice(0, 3).map((member) => (
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
                  <span className="text-2xl font-bold text-evergreen">${product.price.toFixed(2)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm line-through text-stone ml-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {!isLoggedIn && !isCanceled && !isFull && (
                  <span className="text-sm font-semibold text-harvest-gold">
                    Sign In to Join →
                  </span>
                )}
              </div>

              {/* Join Button */}
              <button
                onClick={handleJoinGroup}
                disabled={hasJoined || isCanceled || isFull}
                className={`w-full h-12 flex items-center justify-center font-bold text-lg rounded-lg transition-all shadow-lg mb-2 ${getButtonStyle()}`}
              >
                {getButtonText()}
              </button>

              {/* Demo Buttons for Edge Cases */}
              <div className="space-y-1">
                {/* Race Condition Demo Button */}
                {!isCanceled && !isFull && spotsLeft > 0 && (
                  <button
                    onClick={handleRaceConditionDemo}
                    className="w-full h-10 flex items-center justify-center border border-harvest-gold/30 text-harvest-gold font-semibold text-sm rounded-lg hover:bg-harvest-gold/10 transition-colors"
                  >
                    <i className="ph-bold ph-lightning mr-2"></i>
                    (Demo) Take Last Spot
                  </button>
                )}

                {/* Farmer Cancel Button */}
                {!isCanceled && (
                  <button
                    onClick={handleCancelDemo}
                    className="w-full h-10 flex items-center justify-center border border-stone/30 text-stone font-semibold text-sm rounded-lg hover:bg-stone/10 transition-colors"
                  >
                    <i className="ph-bold ph-x mr-2"></i>
                    (Demo) Farmer Cancel Listing
                  </button>
                )}
              </div>
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