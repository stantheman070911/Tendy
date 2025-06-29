import React, { useState } from 'react';
import { InteractiveProductCard } from './InteractiveProductCard';
import { productService } from '../services/productService';
import { useNotifications } from '../context/NotificationContext';
import { usePayouts } from '../context/PayoutContext';
import type { ProductWithFarmer } from '../types';

interface HostUser {
  userId: string;
  role: string;
  name: string;
  email: string;
  joinDate: string;
  verificationStatus: string;
  groupsManaged: string[];
}

interface HostDashboardProps {
  host?: HostUser;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({ host }) => {
  const [managedProducts, setManagedProducts] = useState<ProductWithFarmer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [boostingProductId, setBoostingProductId] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<{ [key: string]: 'pending' | 'confirmed' | 'completed' }>({});
  const { addNotification } = useNotifications();
  const { addPayout } = usePayouts();

  // Load host's managed products
  React.useEffect(() => {
    const loadManagedProducts = async () => {
      if (!host) return;
      
      setIsLoading(true);
      try {
        // Get all products and filter those with hosts
        const allProducts = await productService.getAllProducts();
        const hostedProducts = allProducts.filter(p => p.host);
        setManagedProducts(hostedProducts);
        
        // Initialize delivery status for successful groups
        const initialStatus: { [key: string]: 'pending' | 'confirmed' | 'completed' } = {};
        hostedProducts.forEach(product => {
          const filled = product.spotsTotal - product.spotsLeft;
          if (filled >= product.spotsTotal * 0.8) { // 80% filled = ready for delivery
            initialStatus[product.id] = 'pending';
          }
        });
        setDeliveryStatus(initialStatus);
        
      } catch (error) {
        console.error('Error loading managed products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadManagedProducts();
  }, [host]);

  if (!host) {
    return (
      <div className="container mx-auto max-w-screen-xl px-md md:px-lg py-xl">
        <div className="text-center">
          <h2 className="text-3xl font-lora text-evergreen">Host Dashboard</h2>
          <p className="text-charcoal/80 mt-2">No host data available</p>
        </div>
      </div>
    );
  }

  // Calculate host stats
  const totalGroupsHosted = managedProducts.length;
  const totalMembersServed = managedProducts.reduce((sum, p) => sum + (p.spotsTotal - p.spotsLeft), 0);
  const platformCommission = 0.16;
  const hostRewardRate = 0.25; // 25% of platform commission
  
  const totalRevenue = managedProducts.reduce((sum, p) => {
    const filled = p.spotsTotal - p.spotsLeft;
    return sum + (filled * p.price);
  }, 0);
  
  const totalCommission = totalRevenue * platformCommission;
  const hostEarnings = totalCommission * hostRewardRate;

  // Community Boost function
  const handleCommunityBoost = async (productId: string, productTitle: string) => {
    setBoostingProductId(productId);
    
    addNotification('Activating Community Boost...', 'info');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful boost
      const notificationsSent = Math.floor(Math.random() * 50) + 20; // 20-70 notifications
      const zipCode = '94105'; // Mock zip code
      
      console.log(`🚨 COMMUNITY BOOST: Activated for ${productTitle}`);
      console.log(`📧 NOTIFICATIONS: Sent to ${notificationsSent} neighbors in ${zipCode}`);
      console.log(`🎯 TARGET: Users interested in local produce and group buying`);
      
      addNotification(`🚀 Community Boost activated! Notified ${notificationsSent} neighbors in your area.`, 'success');
      
      // Show additional success details
      setTimeout(() => {
        addNotification(`📧 Boost details: ${notificationsSent} notifications sent to zip code ${zipCode}`, 'info');
      }, 1000);
      
    } catch (error) {
      console.error('Community Boost error:', error);
      addNotification('Failed to activate Community Boost. Please try again.', 'error');
    } finally {
      setBoostingProductId(null);
    }
  };

  // Enhanced Delivery Confirmation Function with Payout Integration
  const handleConfirmDelivery = async (productId: string, productTitle: string) => {
    if (deliveryStatus[productId] !== 'pending') return;

    addNotification('Confirming delivery and processing payouts...', 'info');
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update delivery status
      setDeliveryStatus(prev => ({
        ...prev,
        [productId]: 'confirmed'
      }));
      
      // Calculate farmer payout (92% of revenue after 8% platform fee)
      const product = managedProducts.find(p => p.id === productId);
      if (product) {
        const filled = product.spotsTotal - product.spotsLeft;
        const totalRevenue = filled * product.price;
        const farmerPayout = totalRevenue * 0.92; // 92% to farmer
        const hostReward = totalRevenue * 0.02; // 2% to host
        
        // Add payout to the system
        addPayout(
          `order-${productId}-${Date.now()}`, 
          product.farmerId, 
          product.farmer.name,
          product.title,
          farmerPayout
        );
        
        console.log(`💰 PAYOUT PROCESSED: ${productTitle}`);
        console.log(`👨‍🌾 FARMER PAYOUT: $${farmerPayout.toFixed(2)} (92% of $${totalRevenue.toFixed(2)})`);
        console.log(`🏠 HOST REWARD: $${hostReward.toFixed(2)} (2% of $${totalRevenue.toFixed(2)})`);
        console.log(`🏢 PLATFORM FEE: $${(totalRevenue * 0.06).toFixed(2)} (6% of $${totalRevenue.toFixed(2)})`);
        
        addNotification(`✅ Delivery confirmed! Farmer payout of $${farmerPayout.toFixed(2)} has been processed.`, 'success');
        
        // Show host reward notification
        setTimeout(() => {
          addNotification(`💰 Your host reward of $${hostReward.toFixed(2)} has been added to your wallet!`, 'success');
        }, 1500);
        
        // Mark as completed after a delay
        setTimeout(() => {
          setDeliveryStatus(prev => ({
            ...prev,
            [productId]: 'completed'
          }));
        }, 3000);
      }
      
    } catch (error) {
      console.error('Delivery confirmation error:', error);
      addNotification('Failed to confirm delivery. Please try again.', 'error');
    }
  };

  const getDeliveryButtonText = (productId: string) => {
    const status = deliveryStatus[productId];
    switch (status) {
      case 'confirmed':
        return 'Processing Payouts...';
      case 'completed':
        return 'Delivery Complete ✓';
      case 'pending':
      default:
        return 'Confirm Delivery & Finalize';
    }
  };

  const getDeliveryButtonStyle = (productId: string) => {
    const status = deliveryStatus[productId];
    switch (status) {
      case 'confirmed':
        return 'bg-harvest-gold text-evergreen cursor-wait';
      case 'completed':
        return 'bg-success text-white cursor-default';
      case 'pending':
      default:
        return 'bg-evergreen text-parchment hover:opacity-90';
    }
  };

  return (
    <div className="container mx-auto max-w-screen-xl px-md md:px-lg py-xl">
      {/* Host Profile Section */}
      <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm mb-xl">
        <div className="flex flex-col md:flex-row items-start gap-lg">
          <div className="flex-shrink-0">
            <img
              src="https://i.pravatar.cc/128?img=10"
              alt={host.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-harvest-gold"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3 mb-md">
              <h2 className="text-3xl font-lora text-evergreen">{host.name}</h2>
              <span className="px-3 py-1 bg-success text-white rounded-full text-sm font-bold">
                ✓ Verified Host
              </span>
            </div>
            
            <p className="text-lg text-charcoal mb-md">
              Hosting since {new Date(host.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-evergreen">{totalGroupsHosted}</div>
                <div className="text-sm text-stone">Groups Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-evergreen">{totalMembersServed}</div>
                <div className="text-sm text-stone">Members Served</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-evergreen">${hostEarnings.toFixed(0)}</div>
                <div className="text-sm text-stone">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-evergreen">4.9⭐</div>
                <div className="text-sm text-stone">Host Rating</div>
              </div>
            </div>

            <div className="bg-parchment rounded-lg p-md">
              <h4 className="font-semibold text-evergreen mb-2">Host Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Verified Pickup Location',
                  'Community Boost Access',
                  'Priority Support',
                  'Earnings Dashboard'
                ].map((benefit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white rounded-full text-sm font-medium text-charcoal border border-stone/20"
                  >
                    ✓ {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Host Reward Wallet */}
      <div className="bg-gradient-to-r from-harvest-gold/10 to-harvest-gold/5 rounded-xl p-lg border border-harvest-gold/20 mb-xl">
        <h3 className="text-2xl font-lora text-evergreen mb-md flex items-center gap-2">
          <i className="ph-bold ph-wallet text-harvest-gold"></i>
          Host Reward Wallet
        </h3>
        
        <div className="grid md:grid-cols-3 gap-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-evergreen mb-2">${hostEarnings.toFixed(2)}</div>
            <div className="text-sm text-charcoal/80">Available Earnings</div>
            <div className="text-xs text-stone mt-1">From {totalGroupsHosted} completed groups</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-harvest-gold mb-2">${(hostEarnings * 0.3).toFixed(2)}</div>
            <div className="text-sm text-charcoal/80">Pending Rewards</div>
            <div className="text-xs text-stone mt-1">From active groups</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-info mb-2">{hostRewardRate * 100}%</div>
            <div className="text-sm text-charcoal/80">Commission Share</div>
            <div className="text-xs text-stone mt-1">Of platform fees</div>
          </div>
        </div>
        
        <div className="mt-lg text-center">
          <button className="h-12 px-8 bg-harvest-gold text-evergreen font-bold rounded-lg hover:scale-105 transition-transform">
            <i className="ph-bold ph-bank mr-2"></i>
            Withdraw Earnings
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-md mb-xl">
        <button className="bg-evergreen text-parchment p-lg rounded-xl hover:opacity-90 transition-opacity">
          <i className="ph-bold ph-plus-circle text-3xl mb-2"></i>
          <div className="font-bold">Create Public Group</div>
          <div className="text-sm opacity-80">Start a new group buy</div>
        </button>
        <button className="bg-harvest-gold text-evergreen p-lg rounded-xl hover:scale-105 transition-transform">
          <i className="ph-bold ph-megaphone text-3xl mb-2"></i>
          <div className="font-bold">Community Boost</div>
          <div className="text-sm opacity-80">Notify neighbors</div>
        </button>
        <button className="bg-white border-2 border-evergreen text-evergreen p-lg rounded-xl hover:bg-evergreen hover:text-parchment transition-colors">
          <i className="ph-bold ph-gear text-3xl mb-2"></i>
          <div className="font-bold">Host Settings</div>
          <div className="text-sm opacity-80">Update pickup details</div>
        </button>
      </div>

      {/* Groups You're Hosting */}
      <div className="mb-xl">
        <h3 className="text-3xl font-lora text-evergreen mb-lg">Groups You're Hosting</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-xl">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-harvest-gold border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
              <p className="text-lg font-semibold text-charcoal">Loading your groups...</p>
            </div>
          </div>
        ) : managedProducts.length > 0 ? (
          <div className="space-y-lg">
            {managedProducts.map(product => {
              const filled = product.spotsTotal - product.spotsLeft;
              const isReadyForDelivery = filled >= product.spotsTotal * 0.8; // 80% filled
              const revenue = filled * product.price;
              const hostReward = revenue * 0.02; // 2% host reward
              
              return (
                <div key={product.id} className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm">
                  <div className="grid md:grid-cols-3 gap-lg items-center">
                    {/* Product Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-md">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-grow">
                          <h4 className="text-xl font-semibold text-evergreen">{product.title}</h4>
                          <p className="text-charcoal/80">From {product.farmer.name}</p>
                          <p className="text-sm text-stone mt-1">
                            {filled} of {product.spotsTotal} spots filled
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-stone/20 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                deliveryStatus[product.id] === 'completed' ? 'bg-success' :
                                isReadyForDelivery ? 'bg-harvest-gold' : 'bg-info'
                              }`}
                              style={{ width: `${(filled / product.spotsTotal) * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="text-success font-semibold">
                              ${hostReward.toFixed(2)} host reward
                            </span>
                            <span className="text-stone">
                              {product.daysLeft} days left
                            </span>
                            {deliveryStatus[product.id] === 'completed' && (
                              <span className="text-success font-semibold">
                                ✓ Delivery Complete
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Host Actions */}
                    <div className="space-y-sm">
                      {/* Delivery Confirmation Button */}
                      {isReadyForDelivery && (
                        <button
                          onClick={() => handleConfirmDelivery(product.id, product.title)}
                          disabled={deliveryStatus[product.id] === 'confirmed' || deliveryStatus[product.id] === 'completed'}
                          className={`w-full h-12 flex items-center justify-center font-semibold rounded-lg transition-all ${getDeliveryButtonStyle(product.id)}`}
                        >
                          {deliveryStatus[product.id] === 'confirmed' ? (
                            <>
                              <i className="ph ph-spinner animate-spin mr-2"></i>
                              Processing...
                            </>
                          ) : deliveryStatus[product.id] === 'completed' ? (
                            <>
                              <i className="ph-bold ph-check-circle mr-2"></i>
                              Complete
                            </>
                          ) : (
                            <>
                              <i className="ph-bold ph-package mr-2"></i>
                              {getDeliveryButtonText(product.id)}
                            </>
                          )}
                        </button>
                      )}
                      
                      {/* Community Boost Button */}
                      <button
                        onClick={() => handleCommunityBoost(product.id, product.title)}
                        disabled={boostingProductId === product.id || deliveryStatus[product.id] === 'completed'}
                        className={`w-full h-12 flex items-center justify-center font-semibold rounded-lg transition-all ${
                          boostingProductId === product.id || deliveryStatus[product.id] === 'completed'
                            ? 'bg-stone/50 text-stone cursor-not-allowed'
                            : 'bg-harvest-gold text-evergreen hover:scale-105'
                        }`}
                      >
                        {boostingProductId === product.id ? (
                          <>
                            <i className="ph ph-spinner animate-spin mr-2"></i>
                            Boosting...
                          </>
                        ) : (
                          <>
                            <i className="ph-bold ph-megaphone mr-2"></i>
                            Community Boost
                          </>
                        )}
                      </button>
                      
                      <button className="w-full h-10 flex items-center justify-center border border-evergreen text-evergreen font-semibold rounded-lg hover:bg-evergreen hover:text-parchment transition-colors">
                        <i className="ph-bold ph-users mr-2"></i>
                        Manage Group
                      </button>
                      
                      <button className="w-full h-10 flex items-center justify-center border border-stone/30 text-stone font-semibold rounded-lg hover:bg-stone/10 transition-colors">
                        <i className="ph-bold ph-chat-circle mr-2"></i>
                        Contact Members
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-xl">
            <div className="bg-white rounded-xl p-xl border border-stone/10 shadow-sm">
              <i className="ph-bold ph-house-line text-stone text-6xl mb-md"></i>
              <h3 className="text-2xl font-lora text-charcoal mb-sm">No Groups Currently Hosted</h3>
              <p className="text-body mb-lg">
                Start hosting group buys to earn rewards and build your local food community.
              </p>
              <button className="h-14 px-8 bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:scale-105 transition-transform">
                <i className="ph-bold ph-plus-circle mr-2"></i>
                Create Your First Group
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delivery & Payout Process Info */}
      <div className="bg-evergreen/5 rounded-xl p-lg border border-evergreen/20 mb-xl">
        <h3 className="text-2xl font-lora text-evergreen mb-md flex items-center gap-2">
          <i className="ph-bold ph-package text-harvest-gold"></i>
          Delivery & Payout Process
        </h3>
        <div className="grid md:grid-cols-2 gap-md text-sm text-charcoal/90">
          <div>
            <h4 className="font-semibold mb-2">📦 Delivery Confirmation</h4>
            <p>When a group reaches 80% capacity, you can confirm successful pickup and trigger final payouts to farmers.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">💰 Automatic Payouts</h4>
            <p>Farmers receive 92% of revenue, you earn 2% as host reward, and 6% covers platform operations.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🔒 Secure Transactions</h4>
            <p>All payments are processed securely with instant notifications to all parties involved.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📊 Transparent Tracking</h4>
            <p>Real-time updates on delivery status, payout processing, and earnings in your host wallet.</p>
          </div>
        </div>
      </div>

      {/* Community Boost Info */}
      <div className="bg-harvest-gold/10 rounded-xl p-lg border border-harvest-gold/20">
        <h3 className="text-2xl font-lora text-evergreen mb-md flex items-center gap-2">
          <i className="ph-bold ph-megaphone text-harvest-gold"></i>
          About Community Boost
        </h3>
        <div className="grid md:grid-cols-2 gap-md text-sm text-charcoal/90">
          <div>
            <h4 className="font-semibold mb-2">🎯 Smart Targeting</h4>
            <p>Notifies neighbors in your zip code who have shown interest in local produce and group buying.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📧 Respectful Outreach</h4>
            <p>Limited to prevent spam. Each group can be boosted once per day with personalized messaging.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📈 Proven Results</h4>
            <p>Community Boost increases group participation by an average of 35% within 24 hours.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🤝 Build Community</h4>
            <p>Helps connect neighbors with local farmers and builds stronger food communities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};