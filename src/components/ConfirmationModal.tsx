import React from 'react';
import type { ProductWithFarmer } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: ProductWithFarmer;
}

// SPECIFICATION FIX: Implement correct 16% commission structure
const BUYER_FEE_PERCENTAGE = 0.08; // 8% buyer fee
const FARMER_DEDUCTION_PERCENTAGE = 0.08; // 8% farmer deduction (total 16% commission)

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, product }) => {
  if (!isOpen) {
    return null;
  }

  // Calculate fees based on the specification
  const subtotal = product.price;
  const buyerFee = subtotal * BUYER_FEE_PERCENTAGE;
  const totalCharge = subtotal + buyerFee;
  
  // Calculate what farmer receives (subtotal minus 8% farmer deduction)
  const farmerDeduction = subtotal * FARMER_DEDUCTION_PERCENTAGE;
  const farmerReceives = subtotal - farmerDeduction;
  
  // Host reward calculation (portion of the 16% commission)
  const hostReward = (buyerFee + farmerDeduction) * 0.125; // 12.5% of total commission = 2% of transaction

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      
      {/* Modal Panel */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-lg text-center animate-fade-in">
        
        {/* Icon */}
        <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto">
          <i className="ph-bold ph-question text-success text-4xl"></i>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-lora mt-md">Confirm Your Group Join</h2>

        {/* Content */}
        <div className="mt-sm space-y-md">
          <p className="text-body">
            You are about to join the group for <strong>{product.title}</strong>
          </p>

          {/* SPECIFICATION FIX: Show correct fee breakdown */}
          <div className="bg-parchment rounded-lg p-md text-left">
            <h4 className="font-semibold text-evergreen mb-md">Payment Breakdown</h4>
            <div className="space-y-sm text-sm">
              <div className="flex justify-between">
                <span>Product Price:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Buyer Fee (8%):</span>
                <span className="font-semibold text-harvest-gold">+${buyerFee.toFixed(2)}</span>
              </div>
              <hr className="border-stone/20" />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total to Authorize:</span>
                <span className="font-bold text-evergreen">${totalCharge.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Fee Distribution Info */}
          <div className="bg-info/10 rounded-lg p-md text-left border border-info/20">
            <h5 className="font-semibold text-info mb-2 flex items-center gap-2">
              <i className="ph-bold ph-info text-info"></i>
              How Fees Work
            </h5>
            <ul className="text-xs text-info/80 space-y-1">
              <li>• Farmer receives: ${farmerReceives.toFixed(2)} (after 8% platform fee)</li>
              <li>• Host reward: ${hostReward.toFixed(2)} (for community service)</li>
              <li>• Platform operations: ${(buyerFee + farmerDeduction - hostReward).toFixed(2)}</li>
              <li>• Total commission: 16% (8% buyer fee + 8% farmer deduction)</li>
            </ul>
          </div>

          <div className="bg-harvest-gold/10 rounded-lg p-md border border-harvest-gold/20">
            <p className="text-sm text-harvest-gold/80">
              <i className="ph-bold ph-shield-check mr-1"></i>
              Your card will only be charged if the group buy is successful. 
              The farmer receives ${farmerReceives.toFixed(2)} after platform fees.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-lg flex flex-col sm:flex-row gap-sm">
          <button 
            onClick={onConfirm}
            className="flex-1 h-12 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
          >
            <i className="ph-bold ph-credit-card mr-2"></i>
            Authorize ${totalCharge.toFixed(2)}
          </button>
          <button 
            onClick={onClose}
            className="flex-1 h-12 flex items-center justify-center bg-stone/10 text-charcoal font-bold text-lg rounded-lg hover:bg-stone/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};