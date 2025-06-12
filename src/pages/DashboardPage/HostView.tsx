import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import type { HostSection } from '../../types';

// Mock data for host dashboard
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

interface HostViewProps {
  activeSection: HostSection;
}

export const HostView: React.FC<HostViewProps> = ({ activeSection }) => {
    const { user } = useAuth();
    const [boostingGroupId, setBoostingGroupId] = useState<number | null>(null);

    // Function to call the Community Boost Edge Function
    const handleBoostClick = async (groupId: number) => {
        setBoostingGroupId(groupId);
        
        try {
            const { data, error } = await supabase.functions.invoke('community-boost', {
                body: { groupId },
            });

            if (error) {
                throw error;
            }

            // Show success message with details
            const message = data.message || 'Community Boost activated!';
            const details = data.details;
            
            if (details) {
                alert(`${message}\n\nGroup: ${details.groupTitle}\nFarm: ${details.farmName}\nArea: ${details.zipCode}\nNotifications sent: ${details.notificationsSent}`);
            } else {
                alert(message);
            }

        } catch (error) {
            console.error("Error boosting community:", error);
            
            // Show user-friendly error message
            const errorMessage = error.message || 'Failed to boost the community. Please try again.';
            alert(`Community Boost Error: ${errorMessage}`);
        } finally {
            setBoostingGroupId(null);
        }
    };

    return (
        <div className="space-y-xl">
            {/* Manage Groups Section */}
            <section className={activeSection === 'manage-groups' ? '' : 'hidden'}>
                <div className="flex flex-wrap justify-between items-center gap-md mb-md">
                    <h2 className="text-3xl font-lora">Manage Groups</h2>
                    <button className="h-12 px-6 flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:scale-105 transition-transform">
                        <i className="ph-bold ph-plus-circle mr-2"></i> Create Public Group
                    </button>
                </div>
                
                <div className="space-y-md">
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
                                    <button className="h-10 px-4 bg-evergreen text-parchment font-semibold rounded-lg hover:opacity-90 transition-opacity">
                                        Manage
                                    </button>
                                    <button className="h-10 px-4 bg-stone/10 text-charcoal font-semibold rounded-lg hover:bg-stone/20 transition-colors">
                                        Contact Members
                                    </button>
                                    {/* Community Boost Button */}
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

                {/* Community Boost Info */}
                <div className="mt-lg bg-harvest-gold/10 rounded-xl p-lg border border-harvest-gold/20">
                    <h3 className="text-2xl font-lora text-evergreen mb-md flex items-center gap-2">
                        <i className="ph-bold ph-megaphone text-harvest-gold"></i>
                        About Community Boost
                    </h3>
                    <div className="space-y-sm text-charcoal/90">
                        <p>
                            <strong>Community Boost</strong> helps you fill your group buys by notifying neighbors in your area who might be interested.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Sends notifications to users in your zip code</li>
                            <li>Includes details about the product and farmer</li>
                            <li>Helps build local food community connections</li>
                            <li>Only available to verified hosts</li>
                        </ul>
                        <p className="text-sm text-charcoal/70 mt-md">
                            <strong>Note:</strong> Use responsibly. Boost notifications are limited to prevent spam.
                        </p>
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
        </div>
    );
};