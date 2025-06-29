import React from 'react';
import { useGroupManagement } from '../context/GroupManagementContext';
import { useNotifications } from '../context/NotificationContext';

export const CustomerGroupView: React.FC = () => {
  const { groupData, respondToTimeChange, finalizeTimeChange, cancelTimeChange } = useGroupManagement();
  const { addNotification } = useNotifications();

  if (!groupData) {
    return (
      <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm">
        <div className="text-center py-lg">
          <i className="ph-bold ph-users-three text-stone text-4xl mb-md"></i>
          <h3 className="text-xl font-semibold text-charcoal mb-2">No Active Groups</h3>
          <p className="text-charcoal/80">You haven't joined any group buys yet.</p>
        </div>
      </div>
    );
  }

  const handleMemberResponse = (response: 'accept' | 'decline') => {
    const memberId = 'current-user'; // In a real app, this would be the actual user ID
    respondToTimeChange(memberId, response);
    
    const responseText = response === 'accept' ? 'accepted' : 'declined';
    addNotification(
      `✅ You ${responseText} the proposed time change. The host will be notified of your response.`,
      response === 'accept' ? 'success' : 'info'
    );

    // Simulate other member responses for demo
    setTimeout(() => {
      const otherMembers = ['member1', 'member2', 'member3'];
      otherMembers.forEach((memberId, index) => {
        setTimeout(() => {
          const randomResponse = Math.random() > 0.3 ? 'accept' : 'decline';
          respondToTimeChange(memberId, randomResponse);
        }, (index + 1) * 1000);
      });
    }, 500);
  };

  const handleHostFinalize = () => {
    finalizeTimeChange();
    addNotification(
      '🎉 Time change finalized! The new pickup time is now confirmed for all members.',
      'success'
    );
  };

  const handleHostCancel = () => {
    cancelTimeChange();
    addNotification(
      'Time change proposal has been canceled. The original pickup time remains unchanged.',
      'info'
    );
  };

  // Calculate response statistics
  const responses = groupData.memberResponses || {};
  const totalResponses = Object.keys(responses).length;
  const acceptedCount = Object.values(responses).filter(r => r === 'accept').length;
  const declinedCount = Object.values(responses).filter(r => r === 'decline').length;
  const responseRate = totalResponses > 0 ? (totalResponses / (groupData.totalMembers || 8)) * 100 : 0;

  return (
    <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm">
      <div className="flex items-center gap-3 mb-lg">
        <i className="ph-bold ph-users-three text-harvest-gold text-3xl"></i>
        <div>
          <h3 className="text-2xl font-lora text-evergreen">{groupData.name}</h3>
          <p className="text-charcoal/80">Your active group buy</p>
        </div>
      </div>

      {/* Current Pickup Time */}
      <div className="bg-parchment rounded-lg p-md mb-lg">
        <h4 className="font-semibold text-evergreen mb-2 flex items-center gap-2">
          <i className="ph-bold ph-clock text-harvest-gold"></i>
          Current Pickup Time
        </h4>
        <p className="text-lg font-semibold text-charcoal">{groupData.pickupTime}</p>
      </div>
      
      {/* Time Change Proposal */}
      {groupData.proposedTime && (
        <div className="bg-gradient-to-r from-harvest-gold/10 to-harvest-gold/5 rounded-lg p-lg border-2 border-harvest-gold/30 mb-lg">
          <div className="flex items-start gap-3 mb-md">
            <i className="ph-bold ph-bell text-harvest-gold text-2xl mt-1"></i>
            <div className="flex-grow">
              <h4 className="text-xl font-bold text-evergreen mb-2">
                ⏰ Pickup Time Change Proposed
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-semibold text-charcoal/80">Proposed New Time:</span>
                  <p className="text-lg font-bold text-evergreen">{groupData.proposedTime}</p>
                </div>
                {groupData.proposalDate && (
                  <p className="text-sm text-charcoal/60">
                    Proposed {new Date(groupData.proposalDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Explanatory Text - NEW */}
          <div className="bg-white/70 rounded-lg p-md mb-md">
            <p className="text-sm text-charcoal/80 flex items-start gap-2">
              <i className="ph-bold ph-info text-info mt-1"></i>
              <span>
                The pickup time will be officially updated once a majority of the group members approve the change. 
                This collaborative approach ensures everyone has a chance to adjust their schedules.
              </span>
            </p>
          </div>

          {/* Response Statistics */}
          {totalResponses > 0 && (
            <div className="bg-white/50 rounded-lg p-md mb-md">
              <h5 className="font-semibold text-evergreen mb-2">Member Responses</h5>
              <div className="grid grid-cols-3 gap-md text-center">
                <div>
                  <div className="text-2xl font-bold text-success">{acceptedCount}</div>
                  <div className="text-xs text-charcoal/80">Accepted</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-error">{declinedCount}</div>
                  <div className="text-xs text-charcoal/80">Declined</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-info">{responseRate.toFixed(0)}%</div>
                  <div className="text-xs text-charcoal/80">Response Rate</div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Response Buttons */}
          {!responses['current-user'] && (
            <div>
              <p className="text-sm font-semibold text-charcoal mb-3">
                Do you accept this time change?
              </p>
              <div className="flex gap-sm">
                <button
                  onClick={() => handleMemberResponse('accept')}
                  className="flex-1 h-12 flex items-center justify-center bg-success text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <i className="ph-bold ph-check mr-2"></i>
                  Accept
                </button>
                <button
                  onClick={() => handleMemberResponse('decline')}
                  className="flex-1 h-12 flex items-center justify-center bg-error text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <i className="ph-bold ph-x mr-2"></i>
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* User's Response Status */}
          {responses['current-user'] && (
            <div className={`text-center p-md rounded-lg ${
              responses['current-user'] === 'accept' 
                ? 'bg-success/20 text-success' 
                : 'bg-error/20 text-error'
            }`}>
              <i className={`ph-bold ${
                responses['current-user'] === 'accept' ? 'ph-check-circle' : 'ph-x-circle'
              } text-2xl mb-2`}></i>
              <p className="font-semibold">
                You {responses['current-user'] === 'accept' ? 'accepted' : 'declined'} this time change
              </p>
              <p className="text-sm opacity-80">
                Waiting for other members to respond...
              </p>
            </div>
          )}

          {/* Host Actions (Demo) */}
          <div className="mt-md pt-md border-t border-harvest-gold/20">
            <p className="text-xs text-charcoal/60 mb-2">Host Actions (Demo):</p>
            <div className="flex gap-sm">
              <button
                onClick={handleHostFinalize}
                className="flex-1 h-10 flex items-center justify-center bg-evergreen text-parchment font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                <i className="ph-bold ph-check mr-1"></i>
                Finalize Change
              </button>
              <button
                onClick={handleHostCancel}
                className="flex-1 h-10 flex items-center justify-center border border-stone/30 text-charcoal font-semibold text-sm rounded-lg hover:bg-stone/10 transition-colors"
              >
                <i className="ph-bold ph-x mr-1"></i>
                Cancel Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Members */}
      <div className="bg-parchment rounded-lg p-md">
        <h4 className="font-semibold text-evergreen mb-3 flex items-center gap-2">
          <i className="ph-bold ph-users text-harvest-gold"></i>
          Group Members ({groupData.totalMembers || 8})
        </h4>
        <div className="flex items-center -space-x-2">
          {Array.from({ length: groupData.totalMembers || 8 }, (_, i) => (
            <img
              key={i}
              src={`https://i.pravatar.cc/40?img=${i + 10}`}
              alt={`Member ${i + 1}`}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ))}
        </div>
        <p className="text-sm text-charcoal/60 mt-2">
          All members will be notified of any time changes
        </p>
      </div>
    </div>
  );
};