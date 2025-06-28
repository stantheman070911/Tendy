// src/components/NotificationPanel.jsx
import React from 'react';
import { useApp } from '../store/AppContext';

export const NotificationPanel = () => {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) {
    return null;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'ph-check-circle';
      case 'error':
        return 'ph-x-circle';
      case 'warning':
        return 'ph-warning-circle';
      case 'info':
      default:
        return 'ph-info';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-error text-white';
      case 'warning':
        return 'bg-harvest-gold text-evergreen';
      case 'info':
      default:
        return 'bg-evergreen text-parchment';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification-item ${getNotificationColor(notification.type)} p-4 rounded-lg shadow-lg animate-slide-in flex items-start gap-3`}
        >
          <i className={`${getNotificationIcon(notification.type)} text-xl flex-shrink-0 mt-0.5`}></i>
          <div className="flex-grow">
            <p className="font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-current opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <i className="ph-bold ph-x text-lg"></i>
          </button>
        </div>
      ))}
    </div>
  );
};