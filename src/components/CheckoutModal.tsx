import React from 'react';
import type { ProductWithFarmer } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: ProductWithFarmer;
}

// The fee is defined as 8% in the specification
const BUYER_FEE_PERCENTAGE = 0.08;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onConfirm, product }) => {
  if (!isOpen) {
    return null;
  }

  // Calculate fees based on the spec
  const subtotal = product.price;
  const platformFee = subtotal * BUYER_FEE_PERCENTAGE;
  const totalCharge = subtotal + platformFee;

  const handleConfirm = () => {
    // Here you would call your authorization logic
    onConfirm();
    onClose();
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      
      {/* Modal Panel */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-lg animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-3xl font-lora text-evergreen">Confirm Your Order</h2>
          <button
            onClick={onClose}
            className="text-stone hover:text-charcoal text-3xl"
          >
            <i className="ph-bold ph-x"></i>
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-md mb-lg">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h3 className="font-semibold text-evergreen">{product.title}</h3>
            <p className="text-sm text-stone">From {product.farmer.name}</p>
            <p className="text-sm text-charcoal">{product.weight}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-parchment rounded-lg p-md mb-lg">
          <h4 className="font-semibold text-evergreen mb-md">Order Summary</h4>
          
          <div className="space-y-sm">
            <div className="flex justify-between items-center">
              <span className="text-charcoal">Your Item:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-charcoal">Platform & Host Fee (8%):</span>
                <div className="text-xs text-stone mt-1">
                  Supports the platform and rewards your community host
                </div>
              </div>
              <span className="font-semibold text-harvest-gold">+${platformFee.toFixed(2)}</span>
            </div>
            
            <hr className="border-stone/20" />
            
            <div className="flex justify-between items-center text-lg">
              <strong className="text-evergreen">Total to be Authorized:</strong>
              <strong className="text-evergreen">${totalCharge.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-info/10 rounded-lg p-md mb-lg border border-info/20">
          <div className="flex items-start gap-2">
            <i className="ph-bold ph-info text-info text-xl mt-1"></i>
            <div>
              <p className="text-sm text-info font-semibold">Payment Authorization</p>
              <p className="text-xs text-info/80 mt-1">
                Your card will only be charged if the group buy reaches its minimum size. 
                If the group doesn't fill, your authorization will be automatically released.
              </p>
            </div>
          </div>
        </div>

        {/* Fee Breakdown Info */}
        <div className="bg-harvest-gold/10 rounded-lg p-md mb-lg border border-harvest-gold/20">
          <h5 className="font-semibold text-evergreen mb-2 flex items-center gap-2">
            <i className="ph-bold ph-chart-pie text-harvest-gold"></i>
            Where Your 8% Fee Goes
          </h5>
          <div className="space-y-1 text-sm text-charcoal/80">
            <div className="flex justify-between">
              <span>• Platform operations & support</span>
              <span>6%</span>
            </div>
            <div className="flex justify-between">
              <span>• Community host reward</span>
              <span>2%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-sm">
          <button
            onClick={handleConfirm}
            className="flex-1 h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
          >
            <i className="ph-bold ph-credit-card mr-2"></i>
            Authorize & Join Group
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-14 flex items-center justify-center border-2 border-stone/30 text-charcoal font-bold text-lg rounded-lg hover:bg-stone/10 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-md">
          <p className="text-xs text-stone">
            <i className="ph-bold ph-lock mr-1"></i>
            Secure payment processing • No charges until group is successful
          </p>
        </div>
      </div>
    </div>
  );
};