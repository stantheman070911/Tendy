import React, { useState } from 'react';
import { useSubscriptions, type Subscription } from '../context/SubscriptionContext';
import { useNotifications } from '../context/NotificationContext';

export const SubscriptionManagementView: React.FC = () => {
  const { 
    subscriptions, 
    pauseSubscription, 
    resumeSubscription, 
    cancelSubscription, 
    updateDeliveryFrequency 
  } = useSubscriptions();
  const { addNotification } = useNotifications();
  const [editingSubscription, setEditingSubscription] = useState<string | null>(null);
  const [newFrequency, setNewFrequency] = useState<Subscription['deliveryFrequency']>('Weekly');

  const activeSubscriptions = subscriptions.filter(s => s.status === 'Active');
  const pausedSubscriptions = subscriptions.filter(s => s.status === 'Paused');
  const canceledSubscriptions = subscriptions.filter(s => s.status === 'Canceled');

  const handlePause = (subscriptionId: string, productName: string) => {
    pauseSubscription(subscriptionId);
    addNotification(`⏸️ Subscription paused for ${productName}`, 'info');
  };

  const handleResume = (subscriptionId: string, productName: string) => {
    resumeSubscription(subscriptionId);
    addNotification(`▶️ Subscription resumed for ${productName}`, 'success');
  };

  const handleCancel = (subscriptionId: string, productName: string) => {
    if (confirm(`Are you sure you want to cancel your subscription for ${productName}? This action cannot be undone.`)) {
      cancelSubscription(subscriptionId);
      addNotification(`❌ Subscription canceled for ${productName}`, 'warning');
    }
  };

  const handleUpdateFrequency = (subscriptionId: string, productName: string) => {
    updateDeliveryFrequency(subscriptionId, newFrequency);
    addNotification(`🔄 Delivery frequency updated to ${newFrequency.toLowerCase()} for ${productName}`, 'success');
    setEditingSubscription(null);
  };

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'Active':
        return 'text-success bg-success/10 border-success/30';
      case 'Paused':
        return 'text-harvest-gold bg-harvest-gold/10 border-harvest-gold/30';
      case 'Canceled':
        return 'text-error bg-error/10 border-error/30';
    }
  };

  const getNextDeliveryText = (subscription: Subscription) => {
    if (subscription.status !== 'Active') return null;
    
    const nextDelivery = new Date(subscription.nextDelivery);
    const now = new Date();
    const diffTime = nextDelivery.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return nextDelivery.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: nextDelivery.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const renderSubscriptionCard = (subscription: Subscription) => (
    <div key={subscription.id} className="bg-white rounded-xl border border-stone/10 shadow-sm overflow-hidden">
      <div className="p-lg">
        <div className="flex items-start gap-md">
          {/* Product Image */}
          <img
            src={subscription.imageUrl}
            alt={subscription.productName}
            className="w-20 h-20 object-cover rounded-lg"
          />
          
          {/* Subscription Details */}
          <div className="flex-grow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-evergreen">{subscription.productName}</h3>
                <p className="text-charcoal/80">From {subscription.farmerName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(subscription.status)}`}>
                {subscription.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-sm">
              <div>
                <span className="text-charcoal/60">Price:</span>
                <p className="font-semibold">${subscription.price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-charcoal/60">Frequency:</span>
                <p className="font-semibold">{subscription.deliveryFrequency}</p>
              </div>
              {subscription.status === 'Active' && (
                <div>
                  <span className="text-charcoal/60">Next Delivery:</span>
                  <p className="font-semibold text-info">{getNextDeliveryText(subscription)}</p>
                </div>
              )}
              <div>
                <span className="text-charcoal/60">Total Deliveries:</span>
                <p className="font-semibold">
                  {subscription.totalDeliveries}
                  {subscription.remainingDeliveries && ` / ${subscription.totalDeliveries + subscription.remainingDeliveries}`}
                </p>
              </div>
            </div>

            {/* Remaining Deliveries Progress */}
            {subscription.remainingDeliveries && subscription.status === 'Active' && (
              <div className="mt-md">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-charcoal/60">Subscription Progress</span>
                  <span className="font-semibold">{subscription.remainingDeliveries} deliveries remaining</span>
                </div>
                <div className="w-full bg-stone/20 rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(subscription.totalDeliveries / (subscription.totalDeliveries + subscription.remainingDeliveries)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-lg pt-lg border-t border-stone/10">
          {subscription.status === 'Active' && (
            <div className="flex flex-wrap gap-sm">
              <button
                onClick={() => {
                  setEditingSubscription(subscription.id);
                  setNewFrequency(subscription.deliveryFrequency);
                }}
                className="h-10 px-4 bg-evergreen/10 text-evergreen font-semibold rounded-lg hover:bg-evergreen/20 transition-colors"
              >
                <i className="ph-bold ph-gear mr-2"></i>
                Change Frequency
              </button>
              <button
                onClick={() => handlePause(subscription.id, subscription.productName)}
                className="h-10 px-4 bg-harvest-gold/10 text-harvest-gold font-semibold rounded-lg hover:bg-harvest-gold/20 transition-colors"
              >
                <i className="ph-bold ph-pause mr-2"></i>
                Pause
              </button>
              <button
                onClick={() => handleCancel(subscription.id, subscription.productName)}
                className="h-10 px-4 bg-error/10 text-error font-semibold rounded-lg hover:bg-error/20 transition-colors"
              >
                <i className="ph-bold ph-x mr-2"></i>
                Cancel
              </button>
            </div>
          )}

          {subscription.status === 'Paused' && (
            <div className="flex gap-sm">
              <button
                onClick={() => handleResume(subscription.id, subscription.productName)}
                className="h-10 px-4 bg-success/10 text-success font-semibold rounded-lg hover:bg-success/20 transition-colors"
              >
                <i className="ph-bold ph-play mr-2"></i>
                Resume
              </button>
              <button
                onClick={() => handleCancel(subscription.id, subscription.productName)}
                className="h-10 px-4 bg-error/10 text-error font-semibold rounded-lg hover:bg-error/20 transition-colors"
              >
                <i className="ph-bold ph-x mr-2"></i>
                Cancel
              </button>
            </div>
          )}

          {subscription.status === 'Canceled' && (
            <div className="text-center py-md">
              <p className="text-sm text-charcoal/60">
                Subscription canceled on {new Date(subscription.startDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Edit Frequency Modal */}
        {editingSubscription === subscription.id && (
          <div className="mt-md p-md bg-parchment rounded-lg border border-stone/20">
            <h5 className="font-semibold text-evergreen mb-md">Change Delivery Frequency</h5>
            <div className="space-y-md">
              <select
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value as Subscription['deliveryFrequency'])}
                className="w-full h-10 px-3 bg-white rounded border border-stone/30 focus:outline-none focus:ring-2 focus:ring-evergreen"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly (Every 2 weeks)</option>
                <option value="Monthly">Monthly</option>
              </select>
              <div className="flex gap-sm">
                <button
                  onClick={() => handleUpdateFrequency(subscription.id, subscription.productName)}
                  className="flex-1 h-10 bg-evergreen text-parchment font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Update Frequency
                </button>
                <button
                  onClick={() => setEditingSubscription(null)}
                  className="flex-1 h-10 border border-stone/30 text-charcoal font-semibold rounded-lg hover:bg-stone/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
          <div>
            <h2 className="text-3xl font-lora text-evergreen">My Subscriptions</h2>
            <p className="text-charcoal/80">Manage your recurring deliveries</p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-md text-center">
            <div className="bg-success/5 rounded-lg p-md border border-success/20">
              <div className="text-2xl font-bold text-success">{activeSubscriptions.length}</div>
              <div className="text-sm text-charcoal/80">Active</div>
            </div>
            <div className="bg-harvest-gold/5 rounded-lg p-md border border-harvest-gold/20">
              <div className="text-2xl font-bold text-harvest-gold">{pausedSubscriptions.length}</div>
              <div className="text-sm text-charcoal/80">Paused</div>
            </div>
            <div className="bg-error/5 rounded-lg p-md border border-error/20">
              <div className="text-2xl font-bold text-error">{canceledSubscriptions.length}</div>
              <div className="text-sm text-charcoal/80">Canceled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <div>
          <h3 className="text-2xl font-lora text-evergreen mb-md">Active Subscriptions</h3>
          <div className="space-y-md">
            {activeSubscriptions.map(renderSubscriptionCard)}
          </div>
        </div>
      )}

      {/* Paused Subscriptions */}
      {pausedSubscriptions.length > 0 && (
        <div>
          <h3 className="text-2xl font-lora text-evergreen mb-md">Paused Subscriptions</h3>
          <div className="space-y-md">
            {pausedSubscriptions.map(renderSubscriptionCard)}
          </div>
        </div>
      )}

      {/* Canceled Subscriptions */}
      {canceledSubscriptions.length > 0 && (
        <div>
          <h3 className="text-2xl font-lora text-evergreen mb-md">Canceled Subscriptions</h3>
          <div className="space-y-md">
            {canceledSubscriptions.map(renderSubscriptionCard)}
          </div>
        </div>
      )}

      {/* No Subscriptions */}
      {subscriptions.length === 0 && (
        <div className="bg-white rounded-xl p-xl border border-stone/10 shadow-sm text-center">
          <i className="ph-bold ph-repeat text-stone text-6xl mb-md"></i>
          <h3 className="text-2xl font-lora text-charcoal mb-sm">No Subscriptions Yet</h3>
          <p className="text-charcoal/80 mb-lg">
            Start a subscription to get regular deliveries of your favorite products and save money!
          </p>
          <button className="h-12 px-6 bg-harvest-gold text-evergreen font-bold rounded-lg hover:scale-105 transition-transform">
            <i className="ph-bold ph-plus mr-2"></i>
            Browse Products
          </button>
        </div>
      )}

      {/* Subscription Benefits */}
      <div className="bg-harvest-gold/10 rounded-xl p-lg border border-harvest-gold/20">
        <h3 className="text-2xl font-lora text-evergreen mb-md flex items-center gap-2">
          <i className="ph-bold ph-star text-harvest-gold"></i>
          Subscription Benefits
        </h3>
        <div className="grid md:grid-cols-2 gap-md text-sm text-charcoal/90">
          <div>
            <h4 className="font-semibold mb-2">💰 Save Money</h4>
            <p>Get 5-15% off regular prices with subscription discounts. Longer commitments = bigger savings!</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🔒 Lock in Pricing</h4>
            <p>Your subscription price is guaranteed for the entire term, protecting you from seasonal price increases.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📅 Never Forget</h4>
            <p>Automatic deliveries mean you'll never run out of your favorite products or forget to order.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🌱 Support Farmers</h4>
            <p>Subscriptions provide farmers with predictable income, helping them plan and invest in sustainable practices.</p>
          </div>
        </div>
      </div>
    </div>
  );
};