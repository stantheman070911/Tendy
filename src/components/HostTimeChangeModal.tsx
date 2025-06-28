import React, { useState } from 'react';
import { useGroupManagement } from '../context/GroupManagementContext';
import { useNotifications } from '../context/NotificationContext';

interface HostTimeChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostId: string;
}

export const HostTimeChangeModal: React.FC<HostTimeChangeModalProps> = ({ 
  isOpen, 
  onClose, 
  hostId 
}) => {
  const { groupData, proposeTimeChange } = useGroupManagement();
  const { addNotification } = useNotifications();
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTime.trim()) {
      addNotification('Please enter a new pickup time', 'warning');
      return;
    }

    // Propose the time change
    proposeTimeChange(newTime, hostId);
    
    // Show success notification
    addNotification(
      `⏰ Time change proposed! Members will be notified about the new pickup time: ${newTime}`,
      'success'
    );
    
    // Simulate member notifications
    setTimeout(() => {
      addNotification(
        `📧 All ${groupData?.totalMembers || 8} group members have been notified of the proposed time change`,
        'info'
      );
    }, 1500);

    // Reset form and close modal
    setNewTime('');
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-lg animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-3xl font-lora text-evergreen">Propose Time Change</h2>
          <button
            onClick={onClose}
            className="text-stone hover:text-charcoal text-3xl"
          >
            <i className="ph-bold ph-x"></i>
          </button>
        </div>

        {/* Current Group Info */}
        <div className="bg-parchment rounded-lg p-md mb-lg">
          <h3 className="font-semibold text-evergreen mb-2">Current Group Details</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/80">Group:</span>
              <span className="font-semibold">{groupData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/80">Current Time:</span>
              <span className="font-semibold">{groupData?.pickupTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/80">Members:</span>
              <span className="font-semibold">{groupData?.totalMembers || 8} people</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          {/* New Time Input */}
          <div>
            <label htmlFor="newTime" className="block font-semibold text-charcoal mb-2">
              Proposed New Pickup Time *
            </label>
            <input
              type="text"
              id="newTime"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="e.g., Sunday, 2:00 PM - 4:00 PM"
              className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
              required
            />
            <p className="text-xs text-charcoal/60 mt-1">
              Be specific about day, time range, and any special instructions
            </p>
          </div>

          {/* Reason Input */}
          <div>
            <label htmlFor="reason" className="block font-semibold text-charcoal mb-2">
              Reason for Change (Optional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g., Weather concerns, scheduling conflict, better availability..."
              className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
            />
          </div>

          {/* Info Box */}
          <div className="bg-info/10 rounded-lg p-md border border-info/20">
            <div className="flex items-start gap-2">
              <i className="ph-bold ph-info text-info text-xl mt-1"></i>
              <div>
                <p className="text-sm text-info font-semibold">How Time Changes Work</p>
                <ul className="text-xs text-info/80 mt-1 space-y-1">
                  <li>• All group members will be notified immediately</li>
                  <li>• Members can accept or decline the proposed change</li>
                  <li>• You can finalize once you have enough responses</li>
                  <li>• Changes take effect immediately when finalized</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-sm pt-md">
            <button
              type="submit"
              className="flex-1 h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
            >
              <i className="ph-bold ph-clock mr-2"></i>
              Propose Time Change
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 flex items-center justify-center border-2 border-stone/30 text-charcoal font-bold text-lg rounded-lg hover:bg-stone/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};