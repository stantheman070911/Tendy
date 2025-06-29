import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

interface RatingModalProps {
  orderId: string;
  farmerName: string;
  productName: string;
  onClose: () => void;
  onSubmit: (orderId: string, rating: number, comment: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ 
  orderId, 
  farmerName, 
  productName,
  onClose, 
  onSubmit 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredRating(starValue);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      addNotification('Please select a rating before submitting.', 'warning');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(orderId, rating, comment);
      addNotification(`✅ Thank you for rating ${farmerName}! Your feedback helps build trust in our community.`, 'success');
      onClose();
    } catch (error) {
      addNotification('Failed to submit rating. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select a rating';
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-lg animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-3xl font-lora text-evergreen">Rate Your Order</h2>
          <button
            onClick={onClose}
            className="text-stone hover:text-charcoal text-3xl"
          >
            <i className="ph-bold ph-x"></i>
          </button>
        </div>

        {/* Order Details */}
        <div className="bg-parchment rounded-lg p-md mb-lg">
          <h3 className="font-semibold text-evergreen mb-2">Order Details</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/80">Product:</span>
              <span className="font-semibold">{productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/80">Farmer:</span>
              <span className="font-semibold">{farmerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/80">Order ID:</span>
              <span className="font-semibold">{orderId}</span>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="text-center mb-lg">
          <h4 className="font-semibold text-evergreen mb-md">How was your experience?</h4>
          <div className="flex justify-center items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`text-5xl transition-all duration-200 hover:scale-110 ${
                  star <= displayRating ? 'text-harvest-gold' : 'text-stone/30'
                }`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
              >
                ★
              </button>
            ))}
          </div>
          <p className={`text-lg font-semibold ${
            displayRating > 0 ? 'text-evergreen' : 'text-stone'
          }`}>
            {getRatingText(displayRating)}
          </p>
        </div>

        {/* Comment Section */}
        <div className="mb-lg">
          <label htmlFor="comment" className="block font-semibold text-charcoal mb-2">
            Share your experience (optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell other customers about the quality, freshness, and your overall experience..."
            className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold resize-none"
            maxLength={500}
          />
          <div className="text-xs text-stone mt-1 text-right">
            {comment.length}/500 characters
          </div>
        </div>

        {/* Impact Message */}
        <div className="bg-harvest-gold/10 rounded-lg p-md mb-lg border border-harvest-gold/20">
          <div className="flex items-start gap-2">
            <i className="ph-bold ph-heart text-harvest-gold text-xl mt-1"></i>
            <div>
              <p className="text-sm text-harvest-gold font-semibold">Your feedback matters!</p>
              <p className="text-xs text-harvest-gold/80 mt-1">
                Ratings help other customers discover great farmers and help farmers improve their service.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-sm">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <i className="ph ph-spinner animate-spin mr-2"></i>
                Submitting...
              </>
            ) : (
              <>
                <i className="ph-bold ph-star mr-2"></i>
                Submit Rating
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 h-14 flex items-center justify-center border-2 border-stone/30 text-charcoal font-bold text-lg rounded-lg hover:bg-stone/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};