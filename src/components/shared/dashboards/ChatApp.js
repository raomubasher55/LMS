"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import Conversation from "./Conversation";
import CoversationPartner from "./CoversationPartner";

const ChatApp = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected, joinChat, leaveChat, sendMessage } = useSocket();

  useEffect(() => {
    fetchUserChats();
  }, []);

  // Socket.io event listeners for real-time messaging
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new messages
    const handleNewMessage = (data) => {
      const { chatId, message, senderId, timestamp } = data;
      
      // Update the active chat if it matches
      if (activeChat && activeChat._id === chatId) {
        setActiveChat(prev => ({
          ...prev,
          messages: [
            ...(prev.messages || []),
            {
              _id: Date.now().toString(),
              message: message.message,
              senderId,
              createdAt: timestamp,
              attachments: message.attachments || []
            }
          ]
        }));
      }
      
      // Update the chat list to show new message
      setChats(prev => prev.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            lastMessage: {
              message: message.message,
              senderId,
              createdAt: timestamp
            },
            unreadCount: chat._id === activeChat?._id ? 0 : (chat.unreadCount || 0) + 1
          };
        }
        return chat;
      }));
    };

    socket.on('new_message', handleNewMessage);

    // Cleanup
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, isConnected, activeChat]);

  // Join/leave chat rooms when active chat changes
  useEffect(() => {
    if (!activeChat || !isConnected) return;

    joinChat(activeChat._id);

    return () => {
      if (activeChat) {
        leaveChat(activeChat._id);
      }
    };
  }, [activeChat, isConnected, joinChat, leaveChat]);

  const fetchUserChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/user-chats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
        if (data.chats?.length > 0) {
          setActiveChat(data.chats[0]);
        }
      } else {
        setError('Failed to load chats');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Error loading chats');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
  };

  const handleSendMessage = async (messageText, attachments = []) => {
    if (!activeChat || !messageText.trim()) return;

    const getCurrentUserId = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.id || payload.userId;
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
      return null;
    };

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('chatId', activeChat._id);
      formData.append('message', messageText);
      
      attachments.forEach((file, index) => {
        formData.append('attachments', file);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${selectedChat}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // Send real-time message via Socket.io
        if (isConnected && socket) {
          sendMessage(activeChat._id, {
            message: messageText,
            attachments: attachments.map(file => ({ name: file.name, size: file.size }))
          }, getCurrentUserId());
        }
        
        // Add message to current chat immediately for instant feedback
        setActiveChat(prev => ({
          ...prev,
          messages: [
            ...(prev.messages || []),
            {
              _id: data.message?._id || Date.now().toString(),
              message: messageText,
              senderId: getCurrentUserId(),
              createdAt: new Date(),
              attachments: data.message?.attachments || []
            }
          ]
        }));
        
        // Update the chat list to reflect latest message
        setChats(prev => prev.map(chat => {
          if (chat._id === activeChat._id) {
            return {
              ...chat,
              lastMessage: {
                message: messageText,
                senderId: getCurrentUserId(),
                createdAt: new Date()
              }
            };
          }
          return chat;
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActiveChat(prev => ({
          ...prev,
          messages: data.messages || []
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {typeof error === 'string' ? error : error?.message || 'An error occurred'}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-15px">
        <h2 className="text-2xl md:text-size-28 font-bold text-blackColor dark:text-blackColor-dark">
          Messages
        </h2>
      </div>
      {/* message body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-30px">
        {/* participant */}
        <CoversationPartner 
          chats={chats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          onRefresh={fetchUserChats}
        />
        {/* conversation */}
        <Conversation 
          activeChat={activeChat}
          onSendMessage={handleSendMessage}
          onRefreshMessages={() => activeChat && fetchChatMessages(activeChat._id)}
        />
      </div>
    </div>
  );
};

export default ChatApp;