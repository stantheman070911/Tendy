import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useNotifications } from '../context/NotificationContext';
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
  const { addSubscription } = useSubscriptions();
  const { addNotification } = useNotifications();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionTerm, setSubscriptionTerm] = useState<'3' | '6' | '12'>('3');
  const [frequency, setFrequency] = useState<'Weekly' | 'Bi-Weekly' | 'Monthly'>('Weekly');

  if (!isOpen) {
    return null;
  }

  // Calculate fees based on the spec
  const subtotal = product.price;
  const platformFee = subtotal * BUYER_FEE_PERCENTAGE;
  const totalCharge = subtotal + platformFee;

  // Calculate subscription savings
  const getSubscriptionDiscount = () => {
    if (!isSubscribing) return 0;
    
    // Subscription discounts: 3 months = 5%, 6 months = 10%, 12 months = 15%
    const discountRates = { '3': 0.05, '6': 0.10, '12': 0.15 };
    return subtotal * discountRates[subscriptionTerm];
  };

  const subscriptionDiscount = getSubscriptionDiscount();
  const subscriptionSubtotal = subtotal - subscriptionDiscount;
  const subscriptionPlatformFee = subscriptionSubtotal * BUYER_FEE_PERCENTAGE;
  const subscriptionTotal = subscriptionSubtotal + subscriptionPlatformFee;

  const getDeliveryCount = () => {
    const termMonths = parseInt(subscriptionTerm);
    switch (frequency) {
      case 'Weekly':
        return termMonths * 4; // Approximate weeks per month
      case 'Bi-Weekly':
        return termMonths * 2;
      case 'Monthly':
        return termMonths;
    }
  };

  const handleConfirm = () => {
    if (isSubscribing) {
      // Create subscription
      const result = addSubscription({
        productName: product.title,
        farmerName: product.farmer.name,
        price: subscriptionSubtotal,
        deliveryFrequency: frequency,
        nextDelivery: '', // Will be calculated in context
        imageUrl: product.imageUrl,
        remainingDeliveries: getDeliveryCount()
      });

      if (result.success) {
        addNotification(
          `🔄 Subscription created! You'll receive ${product.title} ${frequency.toLowerCase()} for ${subscriptionTerm} months.`,
          'success'
        );
      } else {
        addNotification(result.message, 'warning');
        return;
      }
    }

    // Call the original confirm handler
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

        {/* Subscription Option */}
        <div className="bg-harvest-gold/10 rounded-lg p-md mb-lg border border-harvest-gold/20">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="subscribeCheck"
              checked={isSubscribing}
              onChange={(e) => setIsSubscribing(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-stone/50 text-harvest-gold focus:ring-harvest-gold"
            />
            <div className="flex-grow">
              <label htmlFor="subscribeCheck" className="font-semibold text-evergreen cursor-pointer">
                🔄 Make this a recurring subscription
              </label>
              <p className="text-sm text-charcoal/80 mt-1">
                Get regular deliveries and save money with subscription pricing!
              </p>
              
              {isSubscribing && (
                <div className="mt-md space-y-md">
                  {/* Subscription Term */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1">
                      Subscription Length
                    </label>
                    <select 
                      value={subscriptionTerm} 
                      onChange={(e) => setSubscriptionTerm(e.target.value as typeof subscriptionTerm)}
                      className="w-full h-10 px-3 bg-white rounded border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                    >
                      <option value="3">3 Months (5% off each delivery)</option>
                      <option value="6">6 Months (10% off each delivery)</option>
                      <option value="12">12 Months (15% off each delivery)</option>
                    </select>
                  </div>

                  {/* Delivery Frequency */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1">
                      Delivery Frequency
                    </label>
                    <select 
                      value={frequency} 
                      onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                      className="w-full h-10 px-3 bg-white rounded border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Weekly">Bi-Weekly (Every 2 weeks)</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  {/* Subscription Summary */}
                  <div className="bg-white rounded p-3 border border-harvest-gold/30">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Total deliveries:</span>
                        <span className="font-semibold">{getDeliveryCount()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frequency:</span>
                        <span className="font-semibold">{frequency}</span>
                      </div>
                      <div className="flex justify-between text-success">
                        <span>You save per delivery:</span>
                        <span className="font-semibold">${subscriptionDiscount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-parchment rounded-lg p-md mb-lg">
          <h4 className="font-semibold text-evergreen mb-md">
            {isSubscribing ? 'Subscription Summary' : 'Order Summary'}
          </h4>
          
          <div className="space-y-sm">
            <div className="flex justify-between items-center">
              <span className="text-charcoal">
                {isSubscribing ? 'Per delivery:' : 'Your Item:'}
              </span>
              <span className="font-semibold">
                ${isSubscribing ? subscriptionSubtotal.toFixed(2) : subtotal.toFixed(2)}
              </span>
            </div>

            {isSubscribing && subscriptionDiscount > 0 && (
              <div className="flex justify-between items-center text-success">
                <span>Subscription discount:</span>
                <span className="font-semibold">-${subscriptionDiscount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-charcoal">Platform & Host Fee (8%):</span>
                <div className="text-xs text-stone mt-1">
                  Supports the platform and rewards your community host
                </div>
              </div>
              <span className="font-semibold text-harvest-gold">
                +${isSubscribing ? subscriptionPlatformFee.toFixed(2) : platformFee.toFixed(2)}
              </span>
            </div>
            
            <hr className="border-stone/20" />
            
            <div className="flex justify-between items-center text-lg">
              <strong className="text-evergreen">
                {isSubscribing ? 'Per delivery total:' : 'Total to be Authorized:'}
              </strong>
              <strong className="text-evergreen">
                ${isSubscribing ? subscriptionTotal.toFixed(2) : totalCharge.toFixed(2)}
              </strong>
            </div>

            {isSubscribing && (
              <div className="text-center pt-2 border-t border-stone/20">
                <p className="text-sm text-charcoal/80">
                  Total subscription value: <strong>${(subscriptionTotal * getDeliveryCount()).toFixed(2)}</strong>
                </p>
                <p className="text-xs text-success mt-1">
                  You save ${(subscriptionDiscount * getDeliveryCount()).toFixed(2)} compared to one-time purchases!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-info/10 rounded-lg p-md mb-lg border border-info/20">
          <div className="flex items-start gap-2">
            <i className="ph-bold ph-info text-info text-xl mt-1"></i>
            <div>
              <p className="text-sm text-info font-semibold">
                {isSubscribing ? 'Subscription Authorization' : 'Payment Authorization'}
              </p>
              <p className="text-xs text-info/80 mt-1">
                {isSubscribing 
                  ? `Your card will be charged ${subscriptionTotal.toFixed(2)} ${frequency.toLowerCase()} for ${subscriptionTerm} months. You can pause or cancel anytime.`
                  : 'Your card will only be charged if the group buy reaches its minimum size. If the group doesn\'t fill, your authorization will be automatically released.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Benefits */}
        {isSubscribing && (
          <div className="bg-success/10 rounded-lg p-md mb-lg border border-success/20">
            <h5 className="font-semibold text-success mb-2 flex items-center gap-2">
              <i className="ph-bold ph-check-circle text-success"></i>
              Subscription Benefits
            </h5>
            <ul className="text-sm text-success/80 space-y-1">
              <li>• Guaranteed pricing locked in for your entire subscription</li>
              <li>• Priority access to seasonal and limited products</li>
              <li>• Automatic delivery scheduling - no need to remember to order</li>
              <li>• Pause or cancel anytime with 7 days notice</li>
              <li>• Support your local farmers with predictable income</li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-sm">
          <button
            onClick={handleConfirm}
            className="flex-1 h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
          >
            <i className={`ph-bold ${isSubscribing ? 'ph-repeat' : 'ph-credit-card'} mr-2`}></i>
            {isSubscribing ? 'Start Subscription' : 'Authorize & Join Group'}
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
            Secure payment processing • {isSubscribing ? 'Manage subscriptions in your dashboard' : 'No charges until group is successful'}
          </p>
        </div>
      </div>
    </div>
  );
};