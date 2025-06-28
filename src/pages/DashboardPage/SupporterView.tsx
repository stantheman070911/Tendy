import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreateGroupButtons } from '../../components/CreateGroupButtons';
import { CustomerGroupView } from '../../components/CustomerGroupView';
import { HostLeaderboard } from '../../components/HostLeaderboard';
import type { SupporterSection } from '../../types';

// This could be fetched from an API in a real application
const groupBuys = [
    { id: 1, name: 'Heirloom Tomatoes', farmer: 'Rodriguez Farms', progress: 70, spotsFilled: 7, totalSpots: 10, daysLeft: 3, status: 'AWAITING PICKUP' }
];

const orderHistory = [
    { id: 1, name: 'Organic Strawberries', date: 'May 15, 2025', price: 22.00, status: 'DELIVERED' },
    { id: 2, name: 'Artisanal Sourdough', date: 'April 28, 2025', price: 8.00, status: 'DELIVERED' },
    { id: 3, name: 'Free-Range Eggs', date: 'April 10, 2025', price: 6.50, status: 'CANCELED' },
];

interface SupporterViewProps {
  activeSection: SupporterSection;
}

export const SupporterView: React.FC<SupporterViewProps> = ({ activeSection }) => {
  const { user } = useAuth();

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
        <h2 className="text-3xl font-lora mb-md">Order History</h2>
        <div className="bg-white rounded-xl p-md border border-stone/10 shadow-sm">
          <ul className="divide-y divide-stone/10">
            {orderHistory.map(order => (
              <li key={order.id} className="py-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-charcoal">{order.name}</p>
                  <p className="text-sm text-stone">{order.date} - ${order.price.toFixed(2)}</p>
                </div>
                <span className={`font-bold text-sm ${order.status === 'DELIVERED' ? 'text-success' : 'text-error'}`}>{order.status}</span>
              </li>
            ))}
          </ul>
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
    </div>
  );
};