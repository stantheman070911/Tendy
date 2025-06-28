import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let idCounter = 0;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = idCounter++;
    const timestamp = Date.now();
    
    const newNotification: Notification = {
      id,
      message,
      type,
      timestamp,
    };

    setNotifications(currentNotifications => [
      ...currentNotifications,
      newNotification,
    ]);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      setNotifications(currentNotifications =>
        currentNotifications.filter(n => n.id !== id)
      );
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== id)
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};