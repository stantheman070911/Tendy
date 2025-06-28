import React, { useState } from 'react';
import { useDisputes } from '../context/DisputeContext';
import { useNotifications } from '../context/NotificationContext';

interface Order {
  id: string;
  productName: string;
  farmerName: string;
  price: number;
  date: string;
}

interface FileDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

const disputeReasons = [
  { value: 'Quality Issue', label: 'Quality Issue', description: 'Product was damaged, spoiled, or not as described' },
  { value: 'Incorrect Item', label: 'Incorrect Item', description: 'Received wrong product or variety' },
  { value: 'Missing Item', label: 'Missing Item', description: 'Did not receive part or all of the order' },
  { value: 'Damaged Item', label: 'Damaged Item', description: 'Product was damaged during delivery' },
  { value: 'Late Delivery', label: 'Late Delivery', description: 'Pickup was significantly delayed' },
  { value: 'Other', label: 'Other', description: 'Issue not covered by the above categories' }
];

export const FileDisputeModal: React.FC<FileDisputeModalProps> = ({ isOpen, onClose, order }) => {
  const { fileDispute } = useDisputes();
  const { addNotification } = useNotifications();
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason || !comments.trim()) {
      addNotification('Please fill out all required fields.', 'warning');
      return;
    }

    if (comments.trim().length < 10) {
      addNotification('Please provide more detailed comments (at least 10 characters).', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const disputeId = fileDispute({ 
        orderId: order.id, 
        productName: order.productName,
        farmerName: order.farmerName,
        reason, 
        comments: comments.trim(),
        customerName: 'Current User', // In real app, get from auth context
        customerEmail: 'user@example.com' // In real app, get from auth context
      });

      addNotification(
        `✅ Dispute filed successfully! Reference ID: ${disputeId.slice(-6).toUpperCase()}. A host will review it within 24 hours.`,
        'success'
      );

      // Reset form
      setReason('');
      setComments('');
      onClose();

    } catch (error) {
      console.error('Error filing dispute:', error);
      addNotification('Failed to file dispute. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedReason = disputeReasons.find(r => r.value === reason);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-lg">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-lg">
            <h2 className="text-3xl font-lora text-evergreen">File a Dispute</h2>
            <button
              onClick={onClose}
              className="text-stone hover:text-charcoal text-3xl"
            >
              <i className="ph-bold ph-x"></i>
            </button>
          </div>

          {/* Order Information */}
          <div className="bg-parchment rounded-lg p-md mb-lg">
            <h3 className="font-semibold text-evergreen mb-2">Order Details</h3>
            <div className="grid grid-cols-2 gap-md text-sm">
              <div>
                <span className="text-charcoal/80">Product:</span>
                <p className="font-semibold">{order.productName}</p>
              </div>
              <div>
                <span className="text-charcoal/80">Farmer:</span>
                <p className="font-semibold">{order.farmerName}</p>
              </div>
              <div>
                <span className="text-charcoal/80">Order ID:</span>
                <p className="font-semibold">{order.id}</p>
              </div>
              <div>
                <span className="text-charcoal/80">Amount:</span>
                <p className="font-semibold">${order.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-md">
            
            {/* Reason Selection */}
            <div>
              <label htmlFor="reason" className="block font-semibold text-charcoal mb-2">
                What is the issue? *
              </label>
              <div className="space-y-2">
                {disputeReasons.map((reasonOption) => (
                  <label
                    key={reasonOption.value}
                    className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                      reason === reasonOption.value
                        ? 'border-evergreen bg-evergreen/5'
                        : 'border-stone/30 hover:border-evergreen/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reasonOption.value}
                      checked={reason === reasonOption.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        reason === reasonOption.value
                          ? 'border-evergreen bg-evergreen'
                          : 'border-stone/50'
                      }`}>
                        {reason === reasonOption.value && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">{reasonOption.label}</p>
                        <p className="text-sm text-charcoal/70">{reasonOption.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label htmlFor="comments" className="block font-semibold text-charcoal mb-2">
                Please provide detailed information about the issue *
              </label>
              <textarea
                id="comments"
                rows={5}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={selectedReason ? 
                  `Please describe the ${selectedReason.label.toLowerCase()} in detail. Include specific information about what was wrong, when you noticed it, and any other relevant details...` :
                  "Please describe the issue in detail..."
                }
                className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-evergreen"
                required
                minLength={10}
              />
              <p className="text-xs text-charcoal/60 mt-1">
                Minimum 10 characters. The more detail you provide, the faster we can resolve your issue.
              </p>
            </div>

            {/* Resolution Expectations */}
            <div className="bg-info/10 rounded-lg p-md border border-info/20">
              <h4 className="font-semibold text-info mb-2 flex items-center gap-2">
                <i className="ph-bold ph-clock text-info"></i>
                What to Expect
              </h4>
              <ul className="text-sm text-info/80 space-y-1">
                <li>• Your dispute will be reviewed within 24 hours</li>
                <li>• We'll contact the farmer to investigate the issue</li>
                <li>• You'll receive updates via email and in your dashboard</li>
                <li>• Most disputes are resolved within 2-3 business days</li>
                <li>• Refunds (if applicable) are processed within 5-7 business days</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-sm pt-md">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <i className="ph ph-spinner animate-spin mr-2"></i>
                    Filing Dispute...
                  </>
                ) : (
                  <>
                    <i className="ph-bold ph-warning-circle mr-2"></i>
                    File Dispute
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 h-14 flex items-center justify-center border-2 border-stone/30 text-charcoal font-bold text-lg rounded-lg hover:bg-stone/10 transition-colors disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};