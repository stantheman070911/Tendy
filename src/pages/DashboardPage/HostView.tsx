import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreateProductModal } from '../../components/CreateProductModal';
import { HostTimeChangeModal } from '../../components/HostTimeChangeModal';
import { DisputeManagementView } from '../../components/DisputeManagementView';
import { SimpleBarChart } from '../../components/SimpleBarChart';
import { useNotifications } from '../../context/NotificationContext';
import { useGroupManagement } from '../../context/GroupManagementContext';
import type { HostSection, ProductWithFarmer } from '../../types';

interface HostViewProps {
  activeSection: HostSection;
}

// SPECIFICATION FIX: Mock data for earnings chart representing last 6 months
const earningsData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 59 },
  { label: 'Mar', value: 80 },
  { label: 'Apr', value: 81 },
  { label: 'May', value: 56 },
  { label: 'Jun', value: 95 },
];

// SPECIFICATION FIX: Mock data for community growth chart
const communityGrowthData = [
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: 18 },
  { label: 'Mar', value: 25 },
  { label: 'Apr', value: 32 },
  { label: 'May', value: 41 },
  { label: 'Jun', value: 48 },
];

// SPECIFICATION FIX: Mock data for group success rate
const groupSuccessData = [
  { label: 'Jan', value: 85 },
  { label: 'Feb', value: 92 },
  { label: 'Mar', value: 88 },
  { label: 'Apr', value: 95 },
  { label: 'May', value: 90 },
  { label: 'Jun', value: 97 },
];

// SPECIFICATION FIX: Reusable Stat Card component for consistent styling using 8px grid
const StatCard: React.FC<{ title: string; value: string | number; iconClass: string; trend?: string; trendDirection?: 'up' | 'down' }> = ({ 
  title, 
  value, 
  iconClass, 
  trend, 
  trendDirection 
}) => (
  <div className="bg-white p-6 rounded-lg border border-stone/10 shadow-sm">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-12 h-12 bg-harvest-gold/10 rounded-lg">
          <i className={`ph-bold ${iconClass} text-harvest-gold text-2xl`}></i>
        </div>
      </div>
      <div className="ml-4 flex-grow">
        <p className="text-sm font-medium text-charcoal/80 truncate">{title}</p>
        <p className="text-2xl font-lora text-evergreen font-bold">{value}</p>
        {trend && (
          <div className={`flex items-center mt-1 text-sm ${
            trendDirection === 'up' ? 'text-success' : 'text-error'
          }`}>
            <i className={`ph-bold ${
              trendDirection === 'up' ? 'ph-trend-up' : 'ph-trend-down'
            } mr-1`}></i>
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const HostView: React.FC<HostViewProps> = ({ activeSection }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { groupData } = useGroupManagement();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTimeChangeModalOpen, setIsTimeChangeModalOpen] = useState(false);
  const [createdGroups, setCreatedGroups] = useState<ProductWithFarmer[]>([]);
  const [boostingGroupId, setBoostingGroupId] = useState<number | null>(null);

  // SPECIFICATION FIX: Enhanced host stats with more detailed metrics
  const hostStats = {
    totalEarnings: 255.75,
    groupsHosted: 12,
    communitySize: 48,
    successRate: 97,
    avgGroupSize: 8.5,
    totalRevenue: 3200.50,
  };

  // Mock data for existing groups
  const activeGroups = [
    { 
      id: 1, 
      name: 'Heirloom Tomatoes', 
      farmer: 'Rodriguez Farms', 
      members: 8, 
      maxMembers: 10, 
      pickupDate: 'Tomorrow, 5-7 PM',
      status: 'READY_FOR_PICKUP'
    },
    { 
      id: 2, 
      name: 'Farm Fresh Eggs', 
      farmer: 'Sunrise Farm', 
      members: 12, 
      maxMembers: 15, 
      pickupDate: 'Friday, 6-8 PM',
      status: 'COLLECTING_ORDERS'
    }
  ];

  const handleCreateNewGroup = (productData: any) => {
    // Create a new public group with host information
    const newPublicGroup: ProductWithFarmer = {
      id: `host-${Date.now()}`,
      title: productData.title,
      description: productData.description,
      weight: productData.weight,
      price: productData.price,
      originalPrice: productData.originalPrice,
      imageUrl: productData.imageUrl,
      gallery: [productData.imageUrl],
      farmerId: 'host-farmer-1',
      farmer: {
        name: 'Community Marketplace',
        avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
        id: 'host-farmer-1',
        email: 'community@tendy.com',
        role: 'farmer',
        bio: 'Host-curated community marketplace',
        quote: 'Bringing neighbors together through fresh, local food',
        practices: 'Community-Sourced, Local Partnership',
        isVerified: true
      },
      createdAt: new Date().toISOString(),
      endDate: new Date(Date.now() + productData.daysActive * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      hostId: user?.id || 'host01',
      host: {
        name: user?.fullName || 'Community Host',
        avatar: 'https://i.pravatar.cc/80?img=10'
      },
      progress: 0,
      spotsLeft: productData.spotsTotal,
      spotsTotal: productData.spotsTotal,
      daysLeft: productData.daysActive,
      members: []
    };

    // Add to created groups
    setCreatedGroups(prev => [newPublicGroup, ...prev]);
    
    // Log the creation for demo purposes
    console.log('🎉 HOST CREATED NEW PUBLIC GROUP:', {
      hostId: user?.id,
      groupData: newPublicGroup,
      groupType: 'Public',
      createdAt: new Date().toISOString(),
    });

    addNotification(`🎉 Public group "${productData.title}" created successfully! It's now visible to all customers in your area.`, 'success');
    
    // Simulate community notification
    setTimeout(() => {
      const notifiedUsers = Math.floor(Math.random() * 30) + 15; // 15-45 users
      addNotification(`📢 ${notifiedUsers} neighbors have been notified about your new group!`, 'info');
    }, 2000);

    setIsCreateModalOpen(false);
  };

  // Function to call the Community Boost Edge Function
  const handleBoostClick = async (groupId: number) => {
    setBoostingGroupId(groupId);
    
    const loadingToast = addNotification('Activating Community Boost...', 'info');
    
    try {
      // Simulate the edge function call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful response
      const notificationsSent = Math.floor(Math.random() * 50) + 25;
      const zipCode = user?.zipCode || '94105';
      
      addNotification(`🚀 Community Boost activated! Notified ${notificationsSent} neighbors in ${zipCode}.`, 'success');
      
      setTimeout(() => {
        addNotification(`📊 Boost impact: 3 new members joined in the last hour!`, 'success');
      }, 3000);

    } catch (error) {
      console.error("Error boosting community:", error);
      addNotification('Failed to boost the community. Please try again.', 'error');
    } finally {
      setBoostingGroupId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Manage Groups Section */}
      <section className={activeSection === 'manage-groups' ? '' : 'hidden'}>
        {/* SPECIFICATION FIX: Dashboard header with consistent spacing */}
        <div className="mb-8">
          <h1 className="text-4xl font-lora text-evergreen mb-2">Host Dashboard</h1>
          <p className="text-lg text-charcoal/80">Manage your community groups and track your hosting performance</p>
        </div>

        {/* SPECIFICATION FIX: Enhanced stats grid with data visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Earnings" 
            value={`$${hostStats.totalEarnings.toFixed(2)}`} 
            iconClass="ph-wallet" 
            trend="+12% this month"
            trendDirection="up"
          />
          <StatCard 
            title="Groups Hosted" 
            value={hostStats.groupsHosted} 
            iconClass="ph-users-three" 
            trend="+3 this month"
            trendDirection="up"
          />
          <StatCard 
            title="Community Size" 
            value={hostStats.communitySize} 
            iconClass="ph-hand-heart" 
            trend="+7 new members"
            trendDirection="up"
          />
          <StatCard 
            title="Success Rate" 
            value={`${hostStats.successRate}%`} 
            iconClass="ph-chart-line-up" 
            trend="+2% improvement"
            trendDirection="up"
          />
        </div>

        {/* SPECIFICATION FIX: Data Visualization Section with multiple charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Earnings Chart */}
          <div className="bg-white p-6 rounded-lg border border-stone/10 shadow-sm">
            <h2 className="text-2xl font-lora text-evergreen mb-4">
              Monthly Earnings
            </h2>
            <div className="h-72">
              <SimpleBarChart 
                data={earningsData} 
                title=""
                valuePrefix="$"
                color="#EAAA00"
              />
            </div>
          </div>

          {/* Community Growth Chart */}
          <div className="bg-white p-6 rounded-lg border border-stone/10 shadow-sm">
            <h2 className="text-2xl font-lora text-evergreen mb-4">
              Community Growth
            </h2>
            <div className="h-72">
              <SimpleBarChart 
                data={communityGrowthData} 
                title=""
                valuePrefix=""
                color="#2E4034"
              />
            </div>
          </div>
        </div>

        {/* SPECIFICATION FIX: Additional performance metrics */}
        <div className="bg-white p-6 rounded-lg border border-stone/10 shadow-sm mb-8">
          <h2 className="text-2xl font-lora text-evergreen mb-4">
            Group Success Rate
          </h2>
          <div className="h-72">
            <SimpleBarChart 
              data={groupSuccessData} 
              title=""
              valuePrefix=""
              color="#22c55e"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h2 className="text-3xl font-lora text-evergreen">Active Groups</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsTimeChangeModalOpen(true)}
              className="h-12 px-6 flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:scale-105 transition-transform"
            >
              <i className="ph-bold ph-clock mr-2"></i> 
              Propose Time Change
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="h-12 px-6 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:scale-105 transition-transform"
            >
              <i className="ph-bold ph-plus-circle mr-2"></i> 
              Create New Group
            </button>
          </div>
        </div>

        {/* Time Change Status */}
        {groupData?.proposedTime && (
          <div className="bg-gradient-to-r from-harvest-gold/10 to-harvest-gold/5 rounded-xl p-lg border-2 border-harvest-gold/30 mb-lg">
            <div className="flex items-center gap-3 mb-md">
              <i className="ph-bold ph-clock text-harvest-gold text-3xl"></i>
              <div>
                <h3 className="text-xl font-bold text-evergreen">Active Time Change Proposal</h3>
                <p className="text-charcoal/80">Waiting for member responses</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-md">
              <div>
                <p className="text-sm font-semibold text-charcoal/80">Current Time:</p>
                <p className="text-lg font-bold text-charcoal">{groupData.pickupTime}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal/80">Proposed Time:</p>
                <p className="text-lg font-bold text-evergreen">{groupData.proposedTime}</p>
              </div>
            </div>

            {/* Response Summary */}
            {groupData.memberResponses && Object.keys(groupData.memberResponses).length > 0 && (
              <div className="mt-md pt-md border-t border-harvest-gold/20">
                <p className="text-sm font-semibold text-charcoal/80 mb-2">Member Responses:</p>
                <div className="flex gap-md">
                  <span className="text-success font-semibold">
                    ✓ {Object.values(groupData.memberResponses).filter(r => r === 'accept').length} Accepted
                  </span>
                  <span className="text-error font-semibold">
                    ✗ {Object.values(groupData.memberResponses).filter(r => r === 'decline').length} Declined
                  </span>
                  <span className="text-stone font-semibold">
                    ⏳ {(groupData.totalMembers || 8) - Object.keys(groupData.memberResponses).length} Pending
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Host-Created Groups */}
        {createdGroups.length > 0 && (
          <div className="mb-xl">
            <h3 className="text-2xl font-lora text-evergreen mb-md">Your Created Groups</h3>
            <div className="space-y-md">
              {createdGroups.map(group => (
                <div key={group.id} className="bg-white rounded-xl p-md border border-harvest-gold/30 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start gap-md">
                    <img 
                      src={group.imageUrl} 
                      alt={group.title} 
                      className="w-full sm:w-32 h-32 sm:h-auto object-cover rounded-lg" 
                    />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-lora">{group.title}</h3>
                        <span className="px-2 py-1 bg-harvest-gold text-evergreen text-xs font-bold rounded-full">
                          HOST CREATED
                        </span>
                      </div>
                      <p className="font-semibold text-stone">Price: ${group.price} / {group.weight}</p>
                      <p className="text-sm text-charcoal/80 mt-1 line-clamp-2">{group.description}</p>
                      <div className="flex justify-between items-center text-sm font-semibold mt-3">
                        <span className="text-success">
                          {group.spotsTotal - group.spotsLeft} / {group.spotsTotal} spots filled
                        </span>
                        <span className="text-stone">{group.daysLeft} days left</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => setIsTimeChangeModalOpen(true)}
                        className="h-10 px-4 bg-harvest-gold text-evergreen font-semibold rounded-lg hover:scale-105 transition-transform"
                      >
                        <i className="ph-bold ph-clock mr-1"></i>
                        Change Time
                      </button>
                      <button className="h-10 px-4 bg-evergreen text-parchment font-semibold rounded-lg hover:opacity-90 transition-opacity">
                        Manage
                      </button>
                      <button 
                        onClick={() => handleBoostClick(parseInt(group.id))}
                        disabled={boostingGroupId === parseInt(group.id)}
                        className={`h-10 px-4 font-semibold rounded-lg transition-all ${
                          boostingGroupId === parseInt(group.id)
                            ? 'bg-stone/50 text-stone cursor-not-allowed'
                            : 'bg-harvest-gold text-evergreen hover:scale-105'
                        }`}
                      >
                        {boostingGroupId === parseInt(group.id) ? (
                          <>
                            <i className="ph ph-spinner animate-spin mr-1"></i>
                            Boosting...
                          </>
                        ) : (
                          <>
                            <i className="ph-bold ph-megaphone mr-1"></i>
                            Community Boost
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Existing Groups */}
        <div className="space-y-md">
          <h3 className="text-2xl font-lora text-evergreen">Groups You're Hosting</h3>
          {activeGroups.map(group => (
            <div key={group.id} className="bg-white rounded-xl p-md border border-stone/10 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-md">
                <img 
                  src="https://images.unsplash.com/photo-1561138244-64942a482381?q=80&w=200&auto=format&fit=crop" 
                  alt={group.name} 
                  className="w-full sm:w-32 h-32 sm:h-auto object-cover rounded-lg" 
                />
                <div className="flex-grow">
                  <h3 className="text-2xl font-lora">{group.name}</h3>
                  <p className="font-semibold text-stone">From: {group.farmer}</p>
                  <p className="text-sm text-charcoal/80 mt-1">Pickup: {group.pickupDate}</p>
                  <div className="flex justify-between items-center text-sm font-semibold mt-3">
                    <span className="text-success">{group.members} / {group.maxMembers} members</span>
                    <span className={`px-3 py-1 font-bold text-sm rounded-full ${
                      group.status === 'READY_FOR_PICKUP' 
                        ? 'bg-success-light text-success' 
                        : 'bg-info-light text-info'
                    }`}>
                      {group.status === 'READY_FOR_PICKUP' ? 'READY FOR PICKUP' : 'COLLECTING ORDERS'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsTimeChangeModalOpen(true)}
                    className="h-10 px-4 bg-harvest-gold text-evergreen font-semibold rounded-lg hover:scale-105 transition-transform"
                  >
                    <i className="ph-bold ph-clock mr-1"></i>
                    Change Time
                  </button>
                  <button className="h-10 px-4 bg-evergreen text-parchment font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    Manage
                  </button>
                  <button className="h-10 px-4 bg-stone/10 text-charcoal font-semibold rounded-lg hover:bg-stone/20 transition-colors">
                    Contact Members
                  </button>
                  <button 
                    onClick={() => handleBoostClick(group.id)}
                    disabled={boostingGroupId === group.id}
                    className={`h-10 px-4 font-semibold rounded-lg transition-all ${
                      boostingGroupId === group.id
                        ? 'bg-stone/50 text-stone cursor-not-allowed'
                        : 'bg-harvest-gold text-evergreen hover:scale-105'
                    }`}
                  >
                    {boostingGroupId === group.id ? (
                      <>
                        <i className="ph ph-spinner animate-spin mr-1"></i>
                        Boosting...
                      </>
                    ) : (
                      <>
                        <i className="ph-bold ph-megaphone mr-1"></i>
                        Community Boost
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Time Change Management Info */}
        <div className="mt-xl bg-harvest-gold/10 rounded-xl p-lg border border-harvest-gold/20">
          <h3 className="text-2xl font-lora text-evergreen mb-md flex items-center gap-2">
            <i className="ph-bold ph-clock text-harvest-gold"></i>
            Time Change Management
          </h3>
          <div className="grid md:grid-cols-2 gap-md text-sm text-charcoal/90">
            <div>
              <h4 className="font-semibold mb-2">📅 Flexible Scheduling</h4>
              <p>Propose new pickup times when your schedule changes or weather affects original plans.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">👥 Member Consensus</h4>
              <p>All group members are notified instantly and can accept or decline the proposed change.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚡ Real-time Updates</h4>
              <p>See member responses in real-time and finalize changes when you have enough agreement.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔄 Easy Reversal</h4>
              <p>Cancel proposals anytime before finalizing if circumstances change again.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Host Earnings Section */}
      <section className={activeSection === 'earnings' ? '' : 'hidden'}>
        <h2 className="text-3xl font-lora mb-md">Host Earnings & Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
          <div className="bg-white p-md rounded-xl border border-stone/10 shadow-sm text-center">
            <p className="text-stone font-semibold">Total Credits Earned</p>
            <p className="text-3xl font-lora text-evergreen">$89.50</p>
          </div>
          <div className="bg-white p-md rounded-xl border border-stone/10 shadow-sm text-center">
            <p className="text-stone font-semibold">Groups Hosted</p>
            <p className="text-3xl font-lora text-evergreen">{user?.groupsHosted || 0}</p>
          </div>
          <div className="bg-white p-md rounded-xl border border-stone/10 shadow-sm text-center">
            <p className="text-stone font-semibold">Members Served</p>
            <p className="text-3xl font-lora text-evergreen">{user?.totalMembersServed || 0}</p>
          </div>
          <div className="bg-white p-md rounded-xl border border-stone/10 shadow-sm text-center">
            <p className="text-stone font-semibold">Host Rating</p>
            <p className="text-3xl font-lora text-evergreen">4.9 ⭐</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm">
          <h3 className="text-2xl font-lora mb-md">How Host Credits Work</h3>
          <div className="space-y-md text-charcoal/90">
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-percent text-harvest-gold text-2xl mt-1"></i>
              <div>
                <h4 className="font-semibold">Earn 5-8% on Every Order</h4>
                <p className="text-sm">You receive credits based on the total value of orders in your groups</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-shopping-cart text-harvest-gold text-2xl mt-1"></i>
              <div>
                <h4 className="font-semibold">Use Credits for Your Own Orders</h4>
                <p className="text-sm">Apply your earned credits to any group buy you join</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-gift text-harvest-gold text-2xl mt-1"></i>
              <div>
                <h4 className="font-semibold">Bonus for Successful Groups</h4>
                <p className="text-sm">Extra credits when your hosted groups reach their minimum orders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Host Profile Section */}
      <section className={activeSection === 'host-profile' ? '' : 'hidden'}>
        <h2 className="text-3xl font-lora mb-md">Host Profile Settings</h2>
        <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm space-y-md">
          <div className="flex items-center gap-md">
            <img src="https://i.pravatar.cc/80?img=10" alt="Host Avatar" className="w-20 h-20 rounded-full"/>
            <div>
              <h3 className="text-xl font-semibold">{user?.fullName}</h3>
              <p className="text-stone">Verified Host since March 2024</p>
              <button className="mt-2 h-10 px-4 bg-evergreen/10 text-evergreen font-bold text-sm rounded-lg hover:bg-evergreen/20">
                Change Photo
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="pickup-address" className="font-semibold text-charcoal mb-1 block">Pickup Address</label>
            <input 
              id="pickup-address" 
              type="text" 
              defaultValue="123 Maple Street, Springfield, CA 94105" 
              className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30" 
            />
          </div>

          <div>
            <label htmlFor="zip-code" className="font-semibold text-charcoal mb-1 block">
              Zip Code *
              <span className="text-sm font-normal text-charcoal/60 ml-2">(Required for Community Boost)</span>
            </label>
            <input 
              id="zip-code" 
              type="text" 
              defaultValue={user?.zipCode || ''} 
              placeholder="Enter your zip code"
              className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30" 
              required
            />
          </div>
          
          <div>
            <label htmlFor="pickup-instructions" className="font-semibold text-charcoal mb-1 block">Pickup Instructions</label>
            <textarea 
              id="pickup-instructions" 
              rows={3} 
              className="w-full p-4 bg-parchment rounded-md border border-stone/30" 
              defaultValue="Ring doorbell for pickup. Orders will be in coolers on the front porch. Please bring your own bags!"
            />
          </div>
          
          <div>
            <label htmlFor="availability" className="font-semibold text-charcoal mb-1 block">Typical Availability</label>
            <select 
              id="availability" 
              className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30"
              defaultValue="weekend-afternoons"
            >
              <option value="weekday-evenings">Weekday Evenings (5-8 PM)</option>
              <option value="weekend-mornings">Weekend Mornings (8-11 AM)</option>
              <option value="weekend-afternoons">Weekend Afternoons (1-5 PM)</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          
          <button className="h-12 px-8 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90">
            Update Profile
          </button>
        </div>
      </section>

      {/* Dispute Management Section - NEW */}
      <section className={activeSection === 'dispute-management' ? '' : 'hidden'}>
        <DisputeManagementView />
      </section>

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateNewGroup}
        title="Create New Public Group"
        submitButtonText="Publish Group"
        isHostCreated={true}
      />

      {/* Time Change Modal */}
      <HostTimeChangeModal
        isOpen={isTimeChangeModalOpen}
        onClose={() => setIsTimeChangeModalOpen(false)}
        hostId={user?.id || 'host01'}
      />
    </div>
  );
};