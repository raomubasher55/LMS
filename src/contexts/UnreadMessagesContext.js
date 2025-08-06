"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UnreadMessagesContext = createContext();

export const useUnreadMessagesContext = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    // Return a no-op function if context is not available
    return { 
      unreadCount: 0, 
      refetchUnreadCount: () => {},
      markMessagesAsRead: () => {},
      incrementUnreadCount: () => {}
    };
  }
  return context;
};

export const UnreadMessagesProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/unread-messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.data?.unreadCount || 0);
      } else {
        console.error('Failed to fetch unread count');
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchUnreadCount = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const markMessagesAsRead = useCallback((count = 1) => {
    setUnreadCount(prev => Math.max(0, prev - count));
  }, []);

  const incrementUnreadCount = useCallback((count = 1) => {
    setUnreadCount(prev => prev + count);
  }, []);

  // Fetch unread count on mount and when user logs in
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    if (token) {
      fetchUnreadCount();
    }
  }, [fetchUnreadCount]);

  // Refetch every minute to keep count updated
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        fetchUnreadCount();
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const value = {
    unreadCount,
    loading,
    refetchUnreadCount,
    markMessagesAsRead,
    incrementUnreadCount
  };

  return (
    <UnreadMessagesContext.Provider value={value}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export default UnreadMessagesContext;