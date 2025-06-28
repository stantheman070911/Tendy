import React, { useState } from 'react';
import { InviteToGroupModal } from './InviteToGroupModal';
import { useNotifications } from '../context/NotificationContext';
import type { ProductWithFarmer } from '../types';

interface MyPrivateGroupCardProps {
  group: ProductWithFarmer;
  onUpdateGroup?: (updatedGroup: ProductWithFarmer) => void;
}

export const MyPrivateGroupCard: React.FC<MyPrivateGroupCardProps> = ({ group, onUpdateGroup }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  // Calculate group progress
  const filledSpots = group.spotsTotal - group.spotsLeft;
  const progressPercent = (filledSpots / group.spotsTotal) * 100;
  const isGroupFull = group.spotsLeft === 0;
  const needsMoreMembers = filledSpots < group.spotsTotal * 0.5; // Less than 50% filled

  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };

  const handleManageGroup = () => {
    addNotification('Group management features coming soon!', 'info');
  };

  const handleLeaveGroup = () => {
    if (confirm('Are you sure you want to leave this private group? This action cannot be undone.')) {
      addNotification('You have left the private group. Other members will be notified.', 'info');
      // In a real app, this would update the group state
    }
  };

  const getStatusColor = () => {
    if (isGroupFull) return 'text-success';
    if (needsMoreMembers) return 'text-harvest-gold';
    return 'text-info';
  };

  const getStatusText = () => {
    if (isGroupFull) return 'Group Complete - Ready for Order!';
    if (needsMoreMembers) return 'Needs More Members';
    return 'Making Good Progress';
  };

  return (
    <>
      <div className="bg-white rounded-xl p-lg border-2 border-evergreen/30 shadow-sm relative">
        
        {/* Private Group Badge */}
        <div className="absolute top-4 right-4 bg-evergreen text-parchment px-3 py-1 rounded-full text-sm font-bold">
          <i className="ph-bold ph-lock mr-1"></i>
          Private
        </div>

        {/* Group Header */}
        <div className="mb-lg">
          <div className="flex items-start gap-md">
            <img
              src={group.imageUrl}
              alt={group.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-grow">
              <h3 className="text-2xl font-lora text-evergreen">{group.title}</h3>
              <p className="text-charcoal/80">From {group.farmer.name}</p>
              <p className="text-sm text-stone mt-1">{group.weight} • ${group.price} each</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-lg">
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <span className={getStatusColor()}>
              {filledSpots} of {group.spotsTotal} spots filled
            </span>
            <span className="text-stone">{group.daysLeft} days left</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-stone/20 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isGroupFull ? 'bg-success' : 
                needsMoreMembers ? 'bg-harvest-gold' : 'bg-info'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          {/* Status Text */}
          <div className="text-center">
            <span className={`text-sm font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Members Section */}
        {group.members && group.members.length > 0 && (
          <div className="mb-lg">
            <h4 className="font-semibold text-evergreen mb-2 flex items-center gap-2">
              <i className="ph-bold ph-users text-harvest-gold"></i>
              Group Members ({filledSpots})
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-2">
                {group.members.slice(0, 6).map((member) => (
                  <img
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                    title={member.name}
                  />
                ))}
                {filledSpots > 6 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-stone/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-charcoal">+{filledSpots - 6}</span>
                  </div>
                )}
              </div>
              {group.spotsLeft > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  {Array.from({ length: Math.min(group.spotsLeft, 3) }, (_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-dashed border-stone/50 flex items-center justify-center"
                    >
                      <i className="ph-bold ph-plus text-stone/50"></i>
                    </div>
                  ))}
                  {group.spotsLeft > 3 && (
                    <span className="text-sm text-stone ml-1">+{group.spotsLeft - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-sm">
          {/* Primary Action - Invite */}
          {!isGroupFull && (
            <button
              onClick={handleInviteClick}
              className="w-full h-14 flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-lg"
            >
              <i className="ph-bold ph-user-plus mr-2"></i>
              Invite Friends & Family
            </button>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-sm">
            <button
              onClick={handleManageGroup}
              className="h-12 flex items-center justify-center bg-evergreen text-parchment font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <i className="ph-bold ph-gear mr-2"></i>
              Manage
            </button>
            <button
              onClick={handleLeaveGroup}
              className="h-12 flex items-center justify-center border border-error text-error font-semibold rounded-lg hover:bg-error hover:text-white transition-colors"
            >
              <i className="ph-bold ph-sign-out mr-2"></i>
              Leave
            </button>
          </div>
        </div>

        {/* Group Success Message */}
        {isGroupFull && (
          <div className="mt-lg bg-success/10 rounded-lg p-md border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <i className="ph-bold ph-check-circle text-success text-xl"></i>
              <h5 className="font-semibold text-success">Group Complete!</h5>
            </div>
            <p className="text-sm text-success/80">
              Your private group has reached its target. The order will be processed and you'll receive pickup details soon.
            </p>
          </div>
        )}

        {/* Invitation Reminder */}
        {needsMoreMembers && (
          <div className="mt-lg bg-harvest-gold/10 rounded-lg p-md border border-harvest-gold/20">
            <div className="flex items-center gap-2 mb-2">
              <i className="ph-bold ph-users text-harvest-gold text-xl"></i>
              <h5 className="font-semibold text-harvest-gold">Invite More Friends!</h5>
            </div>
            <p className="text-sm text-harvest-gold/80">
              Your group needs {group.spotsTotal - filledSpots} more members to reach the minimum order quantity. 
              Share the invite link to get better prices for everyone!
            </p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <InviteToGroupModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        group={{ id: group.id, name: group.title }}
      />
    </>
  );
};