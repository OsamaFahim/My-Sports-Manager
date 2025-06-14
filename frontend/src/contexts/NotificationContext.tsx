import React, { createContext, useContext, useState, useEffect } from 'react';
import * as notificationService from '../services/NotificationService';
import { useAuth } from './AuthContext';

export interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  seen: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unseenCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAllAsSeen: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let data: Notification[] = [];
      if (isAuthenticated) {
        data = await notificationService.getNotifications();
      } else {
        data = []; 
      }
      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsSeen = async () => {
    setLoading(true);
    try {
      await notificationService.markAllAsSeen();
      setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    if (authLoading) return;
    fetchNotifications();
  }, [isAuthenticated, authLoading]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unseenCount: notifications.filter(n => !n.seen).length,
        loading,
        fetchNotifications,
        markAllAsSeen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}