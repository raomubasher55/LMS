"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    // Only initialize socket on client side
    if (typeof window === 'undefined') return;
    
    // Initialize socket connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to Socket.io server');
      setIsConnected(true);
      
      // Authenticate user if token exists
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.id || payload.userId;
          if (userId) {
            newSocket.emit('authenticate', { userId, token });
          }
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
      setIsConnected(false);
    });

    // User online/offline status handlers
    newSocket.on('user_online', (data) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    newSocket.on('user_offline', (data) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    setSocket(newSocket);

    // Connect the socket
    newSocket.connect();

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Helper functions
  const joinChat = (chatId) => {
    if (!chatId || chatId === 'undefined') {
      console.error('Cannot join chat: chatId is invalid', { chatId });
      return;
    }
    
    if (socket && isConnected) {
      socket.emit('join_chat', chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (!chatId || chatId === 'undefined') {
      console.error('Cannot leave chat: chatId is invalid', { chatId });
      return;
    }
    
    if (socket && isConnected) {
      socket.emit('leave_chat', chatId);
    }
  };

  const sendMessage = (chatId, content, senderId, attachments = []) => {
    if (!chatId || chatId === 'undefined') {
      console.error('Cannot send socket message: chatId is invalid', { chatId });
      return;
    }
    
    if (socket && isConnected) {
      socket.emit('send_message', { 
        chatId, 
        content, 
        senderId,
        attachments
      });
    }
  };

  const startTyping = (chatId, userId) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { chatId, userId });
    }
  };

  const stopTyping = (chatId, userId) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { chatId, userId });
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinChat,
    leaveChat,
    sendMessage,
    startTyping,
    stopTyping,
    isUserOnline
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;