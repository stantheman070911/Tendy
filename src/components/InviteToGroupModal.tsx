import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

interface InviteToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: { id: string; name: string; };
}

export const InviteToGroupModal: React.FC<InviteToGroupModalProps> = ({ isOpen, onClose, group }) => {
  const { addNotification } = useNotifications();
  
  // For the demo, we generate a realistic shareable URL
  const inviteLink = `https://tendy.app/join/${group.id}?ref=private`;
  const [isCopied, setIsCopied] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<'link' | 'email' | 'sms'>('link');
  const [emailAddresses, setEmailAddresses] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      addNotification('✅ Invite link copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setIsCopied(true);
      addNotification('✅ Invite link copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleSendInvites = () => {
    if (inviteMethod === 'email' && !emailAddresses.trim()) {
      addNotification('Please enter at least one email address', 'warning');
      return;
    }
    
    if (inviteMethod === 'sms' && !phoneNumbers.trim()) {
      addNotification('Please enter at least one phone number', 'warning');
      return;
    }

    // Simulate sending invites
    const recipients = inviteMethod === 'email' 
      ? emailAddresses.split(',').map(email => email.trim()).filter(Boolean)
      : phoneNumbers.split(',').map(phone => phone.trim()).filter(Boolean);

    console.log(`📧 PRIVATE GROUP INVITES SENT:`, {
      groupId: group.id,
      groupName: group.name,
      method: inviteMethod,
      recipients: recipients,
      personalMessage: personalMessage || 'Default invitation message',
      inviteLink: inviteLink
    });

    addNotification(
      `🎉 Invitations sent to ${recipients.length} ${inviteMethod === 'email' ? 'email addresses' : 'phone numbers'}!`,
      'success'
    );

    // Reset form
    setEmailAddresses('');
    setPhoneNumbers('');
    setPersonalMessage('');
    onClose();
  };

  const getDefaultMessage = () => {
    return `Hey! I started a private group buy for "${group.name}" on Tendy. Want to join me and save money on fresh, local food? Click the link to join: ${inviteLink}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-lg">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-lg">
            <h2 className="text-3xl font-lora text-evergreen">Invite Friends & Family</h2>
            <button
              onClick={onClose}
              className="text-stone hover:text-charcoal text-3xl"
            >
              <i className="ph-bold ph-x"></i>
            </button>
          </div>

          {/* Group Info */}
          <div className="bg-parchment rounded-lg p-md mb-lg">
            <h3 className="font-semibold text-evergreen mb-2">Private Group Details</h3>
            <div className="flex items-center gap-3">
              <i className="ph-bold ph-lock text-harvest-gold text-2xl"></i>
              <div>
                <p className="font-semibold text-charcoal">{group.name}</p>
                <p className="text-sm text-charcoal/80">Private group • Invite-only access</p>
              </div>
            </div>
          </div>

          {/* Invitation Method Selector */}
          <div className="mb-lg">
            <h4 className="font-semibold text-charcoal mb-md">How would you like to invite people?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              
              {/* Share Link */}
              <button
                onClick={() => setInviteMethod('link')}
                className={`p-md rounded-lg border-2 transition-all ${
                  inviteMethod === 'link'
                    ? 'border-evergreen bg-evergreen/5'
                    : 'border-stone/30 hover:border-evergreen/50'
                }`}
              >
                <div className="text-center">
                  <i className="ph-bold ph-link text-3xl mb-2 text-harvest-gold"></i>
                  <h5 className="font-semibold text-charcoal">Share Link</h5>
                  <p className="text-sm text-charcoal/70">Copy and share anywhere</p>
                </div>
              </button>

              {/* Send Emails */}
              <button
                onClick={() => setInviteMethod('email')}
                className={`p-md rounded-lg border-2 transition-all ${
                  inviteMethod === 'email'
                    ? 'border-evergreen bg-evergreen/5'
                    : 'border-stone/30 hover:border-evergreen/50'
                }`}
              >
                <div className="text-center">
                  <i className="ph-bold ph-envelope text-3xl mb-2 text-harvest-gold"></i>
                  <h5 className="font-semibold text-charcoal">Send Emails</h5>
                  <p className="text-sm text-charcoal/70">Direct email invitations</p>
                </div>
              </button>

              {/* Send SMS */}
              <button
                onClick={() => setInviteMethod('sms')}
                className={`p-md rounded-lg border-2 transition-all ${
                  inviteMethod === 'sms'
                    ? 'border-evergreen bg-evergreen/5'
                    : 'border-stone/30 hover:border-evergreen/50'
                }`}
              >
                <div className="text-center">
                  <i className="ph-bold ph-device-mobile text-3xl mb-2 text-harvest-gold"></i>
                  <h5 className="font-semibold text-charcoal">Send SMS</h5>
                  <p className="text-sm text-charcoal/70">Text message invites</p>
                </div>
              </button>
            </div>
          </div>

          {/* Share Link Method */}
          {inviteMethod === 'link' && (
            <div className="space-y-md">
              <div>
                <label className="block font-semibold text-charcoal mb-2">
                  Your Private Group Invite Link
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={inviteLink} 
                    readOnly 
                    className="flex-grow h-12 px-4 bg-parchment rounded-md border border-stone/30 text-charcoal font-mono text-sm"
                  />
                  <button 
                    onClick={handleCopy}
                    className={`h-12 px-6 font-bold rounded-md transition-all ${
                      isCopied 
                        ? 'bg-success text-white' 
                        : 'bg-harvest-gold text-evergreen hover:scale-105'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <i className="ph-bold ph-check mr-2"></i>
                        Copied!
                      </>
                    ) : (
                      <>
                        <i className="ph-bold ph-copy mr-2"></i>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-charcoal/60 mt-2">
                  Share this link with friends and family via text, email, or social media
                </p>
              </div>

              {/* Quick Share Buttons */}
              <div className="bg-parchment rounded-lg p-md">
                <h5 className="font-semibold text-evergreen mb-md">Quick Share Options</h5>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => {
                      const message = encodeURIComponent(getDefaultMessage());
                      window.open(`sms:?body=${message}`, '_blank');
                    }}
                    className="h-10 px-4 bg-info text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <i className="ph-bold ph-device-mobile mr-2"></i>
                    Text Message
                  </button>
                  <button 
                    onClick={() => {
                      const subject = encodeURIComponent(`Join my private group: ${group.name}`);
                      const body = encodeURIComponent(getDefaultMessage());
                      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                    }}
                    className="h-10 px-4 bg-evergreen text-parchment font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <i className="ph-bold ph-envelope mr-2"></i>
                    Email
                  </button>
                  <button 
                    onClick={() => {
                      const text = encodeURIComponent(getDefaultMessage());
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="h-10 px-4 bg-success text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <i className="ph-bold ph-chat-circle mr-2"></i>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Method */}
          {inviteMethod === 'email' && (
            <div className="space-y-md">
              <div>
                <label className="block font-semibold text-charcoal mb-2">
                  Email Addresses *
                </label>
                <textarea
                  value={emailAddresses}
                  onChange={(e) => setEmailAddresses(e.target.value)}
                  rows={3}
                  placeholder="friend1@example.com, friend2@example.com, family@example.com"
                  className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                />
                <p className="text-sm text-charcoal/60 mt-1">
                  Separate multiple email addresses with commas
                </p>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  rows={3}
                  placeholder={getDefaultMessage()}
                  className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                />
                <p className="text-sm text-charcoal/60 mt-1">
                  Add a personal touch to your invitation
                </p>
              </div>

              <button
                onClick={handleSendInvites}
                className="w-full h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
              >
                <i className="ph-bold ph-envelope mr-2"></i>
                Send Email Invitations
              </button>
            </div>
          )}

          {/* SMS Method */}
          {inviteMethod === 'sms' && (
            <div className="space-y-md">
              <div>
                <label className="block font-semibold text-charcoal mb-2">
                  Phone Numbers *
                </label>
                <textarea
                  value={phoneNumbers}
                  onChange={(e) => setPhoneNumbers(e.target.value)}
                  rows={3}
                  placeholder="+1234567890, +1987654321, +1555123456"
                  className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                />
                <p className="text-sm text-charcoal/60 mt-1">
                  Include country code. Separate multiple numbers with commas
                </p>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  rows={3}
                  placeholder={getDefaultMessage()}
                  className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                />
                <p className="text-sm text-charcoal/60 mt-1">
                  Keep it short for text messages (160 characters recommended)
                </p>
              </div>

              <button
                onClick={handleSendInvites}
                className="w-full h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
              >
                <i className="ph-bold ph-device-mobile mr-2"></i>
                Send SMS Invitations
              </button>
            </div>
          )}

          {/* Privacy & Security Info */}
          <div className="mt-lg bg-info/10 rounded-lg p-md border border-info/20">
            <h5 className="font-semibold text-info mb-2 flex items-center gap-2">
              <i className="ph-bold ph-shield-check text-info"></i>
              Privacy & Security
            </h5>
            <ul className="text-sm text-info/80 space-y-1">
              <li>• Only people with the invite link can join your private group</li>
              <li>• Invite links expire when the group buy ends</li>
              <li>• You can see who joins and manage group membership</li>
              <li>• All invitations include your name as the group creator</li>
              <li>• We never share contact information with other members</li>
            </ul>
          </div>

          {/* Close Button */}
          <div className="mt-lg">
            <button
              onClick={onClose}
              className="w-full h-12 flex items-center justify-center border-2 border-stone/30 text-charcoal font-bold text-lg rounded-lg hover:bg-stone/10 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};