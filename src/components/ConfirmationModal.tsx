import React from 'react';
import type { Product } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, product }) => {
  if (!isOpen) {
    return null;
  }

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
        <p className="text-body mt-sm">
          You are about to join the group for <strong>{product.title}</strong> for a one-time charge of <strong>${product.price.toFixed(2)}</strong>.
        </p>

        {/* Action Buttons */}
        <div className="mt-lg flex flex-col sm:flex-row gap-sm">
          <button 
            onClick={onConfirm}
            className="flex-1 h-12 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
          >
            Yes, Confirm & Join
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