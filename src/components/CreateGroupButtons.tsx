import React from 'react';
import { usePlaceholderAuth } from '../context/PlaceholderAuthContext';
import type { GroupPermissions } from '../types';

export const CreateGroupButtons: React.FC = () => {
  const { user } = usePlaceholderAuth();

  // Determine permissions based on user role
  const getGroupPermissions = (): GroupPermissions => {
    switch (user?.role) {
      case 'host':
        return {
          canCreatePublic: true,
          canCreatePrivate: true
        };
      case 'supporter':
        return {
          canCreatePublic: false,
          canCreatePrivate: true
        };
      case 'farmer':
        return {
          canCreatePublic: true,
          canCreatePrivate: true
        };
      default:
        return {
          canCreatePublic: false,
          canCreatePrivate: false
        };
    }
  };

  const permissions = getGroupPermissions();

  // Don't render anything if user has no permissions
  if (!permissions.canCreatePublic && !permissions.canCreatePrivate) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm">
      <h3 className="text-2xl font-lora text-evergreen mb-md">Create a Group Buy</h3>
      
      <div className="space-y-md">
        {permissions.canCreatePrivate && (
          <div className="border border-stone/20 rounded-lg p-md">
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-lock text-evergreen text-2xl mt-1"></i>
              <div className="flex-grow">
                <h4 className="font-semibold text-lg">Private Group</h4>
                <p className="text-sm text-charcoal/80 mb-3">
                  Invite specific friends and family. Only people you invite can join.
                </p>
                <button className="h-10 px-4 bg-evergreen text-parchment font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Create Private Group
                </button>
              </div>
            </div>
          </div>
        )}

        {permissions.canCreatePublic && (
          <div className="border border-harvest-gold/30 rounded-lg p-md bg-harvest-gold/5">
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-globe text-harvest-gold text-2xl mt-1"></i>
              <div className="flex-grow">
                <h4 className="font-semibold text-lg">Public Group</h4>
                <p className="text-sm text-charcoal/80 mb-3">
                  Open to all neighbors in your area. Perfect for building community connections.
                </p>
                <button className="h-10 px-4 bg-harvest-gold text-evergreen font-semibold rounded-lg hover:scale-105 transition-transform">
                  Create Public Group
                </button>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'supporter' && (
          <div className="bg-info-light rounded-lg p-md">
            <div className="flex items-start gap-3">
              <i className="ph-bold ph-info text-info text-xl mt-1"></i>
              <div>
                <p className="text-sm text-info font-semibold">Want to create public groups?</p>
                <p className="text-sm text-info/80">
                  Apply to become a verified host to unlock the ability to create public group buys for your neighborhood.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};