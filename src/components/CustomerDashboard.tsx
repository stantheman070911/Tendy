import React, { useState } from 'react';
import { ProductList } from './ProductList';
import { InteractiveProductCard } from './InteractiveProductCard';
import { CreateGroupForm } from './CreateGroupForm';
import { MyPrivateGroupCard } from './MyPrivateGroupCard';
import { usePlaceholderAuth } from '../context/PlaceholderAuthContext';
import type { ProductWithFarmer } from '../types';

export const CustomerDashboard: React.FC = () => {
  const { isLoggedIn } = usePlaceholderAuth();
  const [privateGroups, setPrivateGroups] = useState<ProductWithFarmer[]>([]);

  // Function to handle creating a new private group
  const handleCreateGroup = (newGroup: ProductWithFarmer) => {
    // Add unique ID and mark as private
    const newGroupWithId = {
      ...newGroup,
      id: `private-${Date.now()}`,
      title: `${newGroup.title} (Private Group)`,
      spotsLeft: newGroup.spotsTotal - 1, // Creator automatically joins
      members: [
        { id: 'creator', avatar: 'https://i.pravatar.cc/48?img=20', name: 'You (Creator)' }
      ]
    };
    
    setPrivateGroups(prevGroups => [newGroupWithId, ...prevGroups]);
    console.log('New private group created:', newGroupWithId);
  };

  // Function to update a private group
  const handleUpdateGroup = (updatedGroup: ProductWithFarmer) => {
    setPrivateGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === updatedGroup.id ? updatedGroup : group
      )
    );
  };

  return (
    <div className="container mx-auto max-w-screen-xl px-md md:px-lg py-xl">
      {/* Welcome Section */}
      <div className="text-center mb-xl">
        <h1 className="text-4xl md:text-5xl font-lora text-evergreen">Customer Dashboard</h1>
        <p className="text-body mt-md max-w-2xl mx-auto">
          Discover fresh, local produce through community group buying. Create private groups 
          with friends or join public groups in your neighborhood.
        </p>
      </div>

      {/* Create Private Group Section */}
      <div className="mb-xl">
        <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm">
          <h2 className="text-3xl font-lora text-evergreen mb-md flex items-center gap-3">
            <i className="ph-bold ph-users-three text-harvest-gold"></i>
            Create a Private Group
          </h2>
          <p className="text-charcoal/80 mb-lg">
            Start a private group buy with your friends and family. Only people you invite can join.
          </p>
          <CreateGroupForm onCreateGroup={handleCreateGroup} />
        </div>
      </div>

      {/* Your Private Groups */}
      {privateGroups.length > 0 && (
        <div className="mb-xl">
          <h2 className="text-3xl font-lora text-evergreen mb-lg flex items-center gap-3">
            <i className="ph-bold ph-lock text-evergreen"></i>
            Your Private Groups
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {privateGroups.map(group => (
              <MyPrivateGroupCard 
                key={group.id} 
                group={group}
                onUpdateGroup={handleUpdateGroup}
              />
            ))}
          </div>
          
          {/* Private Group Tips */}
          <div className="mt-lg bg-evergreen/5 rounded-xl p-lg border border-evergreen/20">
            <h3 className="text-xl font-semibold text-evergreen mb-md flex items-center gap-2">
              <i className="ph-bold ph-lightbulb text-harvest-gold"></i>
              Private Group Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-md text-sm text-charcoal/90">
              <div>
                <h4 className="font-semibold mb-2">📧 Invite Strategically</h4>
                <p>Start with family and close friends who you know are interested in fresh, local food.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💬 Use Personal Messages</h4>
                <p>Add a personal note when inviting to explain why you're excited about the product.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⏰ Set Expectations</h4>
                <p>Let invitees know the deadline and minimum group size needed for the order to go through.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔄 Follow Up</h4>
                <p>Send friendly reminders as the deadline approaches to help your group reach its goal.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Public Group Buys */}
      <div>
        <h2 className="text-3xl font-lora text-evergreen mb-lg flex items-center gap-3">
          <i className="ph-bold ph-globe text-harvest-gold"></i>
          Discover Public Groups
        </h2>
        <ProductList 
          isLoggedIn={isLoggedIn} 
          title=""
          subtitle="Join your neighbors to unlock group savings on this week's harvest."
        />
      </div>

      {/* Customer Tips */}
      <div className="mt-xl bg-evergreen/5 rounded-xl p-lg border border-evergreen/20">
        <h3 className="text-2xl font-lora text-evergreen mb-md flex items-center gap-2">
          <i className="ph-bold ph-lightbulb text-harvest-gold"></i>
          Tips for Group Buying Success
        </h3>
        <div className="grid md:grid-cols-2 gap-md text-sm text-charcoal/90">
          <div>
            <h4 className="font-semibold mb-2">👥 Private Groups</h4>
            <p>Perfect for families and close friends. You control who joins and can coordinate pickup easily.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🌍 Public Groups</h4>
            <p>Great way to meet neighbors and try new farms. Hosted by verified community members.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">💳 Payment Security</h4>
            <p>Your payment is only authorized, not charged, until the group reaches its minimum size.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📦 Fresh Guarantee</h4>
            <p>All produce is harvested within 24-48 hours of pickup for maximum freshness.</p>
          </div>
        </div>
      </div>
    </div>
  );
};