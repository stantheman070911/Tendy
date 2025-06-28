import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreateGroupButtons } from '../../components/CreateGroupButtons';
import { CustomerGroupView } from '../../components/CustomerGroupView';
import { HostLeaderboard } from '../../components/HostLeaderboard';
import { FileDisputeModal } from '../../components/FileDisputeModal';
import type { SupporterSection } from '../../types';

// This could be fetched from an API in a real application
const groupBuys = [
    { id: 1, name: 'Heirloom Tomatoes', farmer: 'Rodriguez Farms', progress: 70, spotsFilled: 7, totalSpots: 10, daysLeft: 3, status: 'AWAITING PICKUP' }
];

const orderHistory = [
    { 
      id: 'order-001', 
      name: 'Organic Strawberries', 
      date: 'May 15, 2025', 
      price: 22.00, 
      status: 'DELIVERED',
      farmerName: 'Berry Fresh Farms'
    },
    { 
      id: 'order-002', 
      name: 'Artisanal Sourdough', 
      date: 'April 28, 2025', 
      price: 8.00, 
      status: 'DELIVERED',
      farmerName: 'Heritage Bakery'
    },
    { 
      id: 'order-003', 
      name: 'Free-Range Eggs', 
      date: 'April 10, 2025', 
      price: 6.50, 
      status: 'CANCELED',
      farmerName: 'Green Valley Produce'
    },
    { 
      id: 'order-004', 
      name: 'Heirloom Tomatoes', 
      date: 'March 22, 2025', 
      price: 18.00, 
      status: 'DELIVERED',
      farmerName: 'Rodriguez Farms'
    },
];

interface SupporterViewProps {
  activeSection: SupporterSection;
}

export const SupporterView: React.FC<SupporterViewProps> = ({ activeSection }) => {
  const { user } = useAuth();
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof orderHistory[0] | null>(null);

  const handleFileDispute = (order: typeof orderHistory[0]) => {
    setSelectedOrder(order);
    setIsDisputeModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-success';
      case 'CANCELED':
        return 'text-error';
      case 'PENDING':
        return 'text-harvest-gold';
      default:
        return 'text-stone';
    }
  };

  const canFileDispute = (order: typeof orderHistory[0]) => {
    // Can file dispute for delivered orders within 7 days
    if (order.status !== 'DELIVERED') return false;
    
    const orderDate = new Date(order.date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff <= 7; // 7-day dispute window
  };

  return (
    <div className="space-y-xl">
      {/* My Group Buys Section */}
      <section className={activeSection === 'group-buys' ? '' : 'hidden'}>
        <h2 className="text-3xl font-lora mb-md">Active Group Buys</h2>
        
        {/* Create Group Buttons - Role-based permissions */}
        <CreateGroupButtons />
        
        {/* Customer Group Management */}
        <div className="mt-lg">
          <h3 className="text-xl font-semibold mb-md">Your Group Activity</h3>
          <CustomerGroupView />
        </div>
        
        <div className="mt-lg">
          <h3 className="text-xl font-semibold mb-md">Groups You've Joined</h3>
          {groupBuys.map(buy => (
            <div key={buy.id} className="bg-white rounded-xl p-md border border-stone/10 shadow-sm flex flex-col sm:flex-row items-start gap-md">
              <img src={`https://images.unsplash.com/photo-1561138244-64942a482381?q=80&w=200&auto=format&fit=crop`} alt={buy.name} className="w-full sm:w-32 h-32 sm:h-auto object-cover rounded-lg"/>
              <div className="flex-grow">
                <h3 className="text-2xl font-lora">{buy.name}</h3>
                <p className="font-semibold text-stone">From: {buy.farmer}</p>
                <div className="w-full bg-success-light rounded-full h-2.5 my-3">
                  <div className="bg-success h-2.5 rounded-full" style={{ width: `${buy.progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-success">{buy.spotsFilled} / {buy.totalSpots} spots filled</span>
                  <span className="text-stone">Ends in {buy.daysLeft} days</span>
                </div>
              </div>
              <div className="w-full sm:w-auto text-center">
                <div className="px-3 py-1 bg-info-light text-info font-bold text-sm rounded-full inline-block">{buy.status}</div>
                <a href="#" className="mt-2 block font-semibold text-evergreen hover:text-harvest-gold">View Details</a>
              </div>
            </div>
          ))}
        </div>

        {/* Host Leaderboard in Dashboard */}
        <div className="mt-xl">
          <HostLeaderboard limit={3} compact={true} />
        </div>
      </section>

      {/* Order History Section */}
      <section className={activeSection === 'order-history' ? '' : 'hidden'}>
        <div className="flex items-center justify-between mb-md">
          <h2 className="text-3xl font-lora">Order History</h2>
          <div className="text-sm text-charcoal/60">
            <i className="ph-bold ph-info mr-1"></i>
            You can file disputes within 7 days of delivery
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-stone/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-parchment border-b border-stone/10">
                <tr>
                  <th className="text-left p-md font-semibold text-charcoal">Product</th>
                  <th className="text-left p-md font-semibold text-charcoal">Farmer</th>
                  <th className="text-left p-md font-semibold text-charcoal">Date</th>
                  <th className="text-left p-md font-semibold text-charcoal">Amount</th>
                  <th className="text-left p-md font-semibold text-charcoal">Status</th>
                  <th className="text-left p-md font-semibold text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone/10">
                {orderHistory.map(order => (
                  <tr key={order.id} className="hover:bg-parchment/50 transition-colors">
                    <td className="p-md">
                      <div>
                        <p className="font-semibold text-charcoal">{order.name}</p>
                        <p className="text-sm text-stone">Order #{order.id}</p>
                      </div>
                    </td>
                    <td className="p-md">
                      <p className="text-charcoal">{order.farmerName}</p>
                    </td>
                    <td className="p-md">
                      <p className="text-charcoal">{order.date}</p>
                    </td>
                    <td className="p-md">
                      <p className="font-semibold text-charcoal">${order.price.toFixed(2)}</p>
                    </td>
                    <td className="p-md">
                      <span className={`font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-md">
                      <div className="flex gap-2">
                        <button className="h-8 px-3 text-sm bg-evergreen/10 text-evergreen font-semibold rounded hover:bg-evergreen/20 transition-colors">
                          View
                        </button>
                        {canFileDispute(order) && (
                          <button
                            onClick={() => handleFileDispute(order)}
                            className="h-8 px-3 text-sm bg-error/10 text-error font-semibold rounded hover:bg-error/20 transition-colors"
                          >
                            <i className="ph-bold ph-warning-circle mr-1"></i>
                            Dispute
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispute Information */}
        <div className="mt-lg bg-info/10 rounded-xl p-lg border border-info/20">
          <h3 className="text-xl font-semibold text-info mb-md flex items-center gap-2">
            <i className="ph-bold ph-shield-check text-info"></i>
            Dispute Protection
          </h3>
          <div className="grid md:grid-cols-2 gap-md text-sm text-info/80">
            <div>
              <h4 className="font-semibold mb-2">When to File a Dispute</h4>
              <ul className="space-y-1">
                <li>• Product quality issues</li>
                <li>• Missing or incorrect items</li>
                <li>• Damaged products</li>
                <li>• Delivery problems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Resolution Process</h4>
              <ul className="space-y-1">
                <li>• 24-hour initial response</li>
                <li>• Investigation with farmer</li>
                <li>• Resolution within 2-3 days</li>
                <li>• Refunds processed if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className={activeSection === 'profile' ? '' : 'hidden'}>
        <h2 className="text-3xl font-lora mb-md">Manage Profile</h2>
          <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm space-y-md">
            <div className="flex items-center gap-md">
              <img src="https://i.pravatar.cc/80?img=10" alt="User Avatar" className="w-20 h-20 rounded-full"/>
              <button className="h-10 px-4 flex items-center justify-center bg-evergreen/10 text-evergreen font-bold text-sm rounded-lg hover:bg-evergreen/20">Change Avatar</button>
            </div>
            <div>
              <label htmlFor="supporter-name" className="font-semibold text-charcoal mb-1 block">Full Name</label>
              <input 
                id="supporter-name" 
                type="text" 
                defaultValue={user?.fullName || ''} 
                className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30"
              />
            </div>
            <div>
              <label htmlFor="supporter-email" className="font-semibold text-charcoal mb-1 block">Email Address</label>
              <input 
                id="supporter-email" 
                type="email" 
                defaultValue={user?.email || ''} 
                className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30"
              />
            </div>
            <div>
              <label htmlFor="supporter-zip" className="font-semibold text-charcoal mb-1 block">Zip Code</label>
              <input 
                id="supporter-zip" 
                type="text" 
                defaultValue={user?.zipCode || ''} 
                placeholder="Enter your zip code"
                className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30"
              />
            </div>
            <button className="h-12 px-8 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90">Update Profile</button>
          </div>
      </section>

      {/* File Dispute Modal */}
      {selectedOrder && (
        <FileDisputeModal
          isOpen={isDisputeModalOpen}
          onClose={() => {
            setIsDisputeModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </div>
  );
};