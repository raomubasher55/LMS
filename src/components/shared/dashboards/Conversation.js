"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSocket } from "@/contexts/SocketContext";
// Use a string path instead of static import to avoid blur placeholder issues
const defaultAvatar = "/assets/images/teacher/teacher__1.png";
import ConversatonSingle from "./ConversatonSingle";
import TranslatedText from "../TranslatedText";

const Conversation = ({ activeChat, onSendMessage, onRefreshMessages, onLoadMoreMessages }) => {
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { socket, isConnected, startTyping, stopTyping, isUserOnline } = useSocket();

  useEffect(() => {
    if (activeChat?.chatId) {
      onRefreshMessages();
    }
  }, [activeChat?.chatId]);

  useEffect(() => {
    // Always scroll to bottom when messages change
    const timeoutId = setTimeout(() => {
      const container = chatContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [activeChat?.messages?.length]);

  // Socket.io typing indicator listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUserTyping = (data) => {
      const { userId, typing } = data;
      const otherParticipant = getOtherParticipant();
      
      if (otherParticipant && otherParticipant._id === userId) {
        setOtherUserTyping(typing);
        
        // Auto-hide typing indicator after 3 seconds
        if (typing) {
          setTimeout(() => setOtherUserTyping(false), 3000);
        }
      }
    };

    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, isConnected, activeChat]);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

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

  const getOtherParticipant = () => {
    if (!activeChat) return null;
    const currentUserId = getCurrentUserId();
    const participant = activeChat.participants?.find(p => p._id !== currentUserId);
    
    return participant;
  };

  const getAvatarUrl = (user) => {
    if (user?.profileImage) {
      return user.profileImage.startsWith('http') 
        ? user.profileImage 
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profileImage}`;
    }
    if (user?.profile) {
      return user.profile.startsWith('http') 
        ? user.profile 
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profile}`;
    }
    return defaultAvatar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    if (!activeChat || loading) return;

    setLoading(true);
    try {
      await onSendMessage(messageText);
      setMessageText("");
      
      // Force scroll after sending message
      setTimeout(() => {
        const container = chatContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleTyping = (e) => {
    setMessageText(e.target.value);
    
    if (!activeChat || !isConnected) return;
    
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    // Start typing indicator
    if (!isTyping) {
      setIsTyping(true);
      startTyping(activeChat.chatId, currentUserId);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing indicator after 1 second of no typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(activeChat.chatId, currentUserId);
    }, 1000);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Transform messages for ConversationSingle component
  const transformedMessages = activeChat?.messages?.map(message => {
    const isCurrentUser = (message.sender?._id || message.senderId) === getCurrentUserId();
    const otherParticipant = getOtherParticipant();
    
    return {
      id: message._id,
      image: isCurrentUser 
        ? null // Current user doesn't need image in their own messages
        : getAvatarUrl(otherParticipant),
      isCurrentUser: isCurrentUser,
      messages: [{
        message: message.content,
        time: formatTime(message.timestamp || message.createdAt),
        attachments: message.attachments || []
      }]
    };
  }) || [];

  if (!activeChat) {
    return (
      <div className="xl:col-start-6 xl:col-span-7">
        <div className="p-10px bg-whiteColor dark:bg-whiteColor-dark rounded-lg2 flex items-center justify-center h-96">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <i className="icofont-chat text-4xl mb-4 block"></i>
            <p><TranslatedText>Sélectionnez une discussion pour commencer à envoyer des messages</TranslatedText></p>
          </div>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <div className="xl:col-start-6 xl:col-span-7">
      <div className="p-10px bg-whiteColor dark:bg-whiteColor-dark rounded-lg2">
        {/* heading */}
        <div className="flex justify-between items-center pb-10px border-b border-borderColor dark:border-borderColor-dark">
          <div className="flex items-center">
            {/* avatar */}
            <div className="max-w-50px mr-5">
              {otherParticipant ? (
                <Image
                  src={otherParticipant.profileImage || otherParticipant.profile || defaultAvatar}
                  alt={otherParticipant.name || 'User'}
                  className="w-full rounded-full"
                  width={50}
                  height={50}
                />
              ) : (
                <div className="w-full h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs">No user</span>
                </div>
              )}
            </div>
            {/* details */}
            <div className="flex-grow">
              <div>
                <h5 className="text-lg font-medium text-blackColor dark:text-blackColor-dark">
                  <span className="leading-6">
                    {otherParticipant?.name || 
                     `${otherParticipant?.firstName || ''} ${otherParticipant?.lastName || ''}`.trim() || 
                     'Unknown User'}
                  </span>
                </h5>
                <p className="text-sm text-darkdeep4 text-start leading-22px">
                  {otherParticipant?.role || 'User'} • {isUserOnline(otherParticipant?._id) ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-10px">
            <button
              onClick={onRefreshMessages}
              className="w-10.5 h-10.5 leading-10.5 box-content text-darkdeep4 hover:text-whiteColor hover:bg-primaryColor border border-borderColor dark:border-borderColor-dark rounded-full text-center"
              title="Refresh messages"
            >
              <i className="icofont-refresh"></i>
            </button>
          </div>
        </div>

        {/* conversation body */}
        <div ref={chatContainerRef} className="max-h-125 overflow-y-auto mt-10 flex flex-col">
          {/* Load More Messages Button */}
          {activeChat?.pagination?.hasMore && onLoadMoreMessages && (
            <div className="text-center py-4">
              <button
                onClick={async () => {
                  setLoadingMore(true);
                  try {
                    await onLoadMoreMessages();
                  } finally {
                    setLoadingMore(false);
                  }
                }}
                disabled={loadingMore}
                className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </span>
                ) : (
                  `Load More Messages (${activeChat.pagination.totalMessages - activeChat.messages?.length || 0} remaining)`
                )}
              </button>
            </div>
          )}
          
          {transformedMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p><TranslatedText>Pas encore de messages. Commencez la conversation</TranslatedText>!</p>
            </div>
          ) : (
            transformedMessages.map((details, idx) => (
              <ConversatonSingle key={details.id || idx} details={details} />
            ))
          )}
          
          {/* Typing indicator */}
          {otherUserTyping && (
            <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>{getOtherParticipant()?.name || 'User'} is typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>


        {/* conversation input */}
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="flex items-center bg-darkdeep3 dark:bg-darkdeep3-dark pl-30px rounded-full md:mr-30px">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Type something..."
                value={messageText}
                onChange={handleTyping}
                disabled={loading}
                className="w-full pl-5 py-10px text-darkdeep4 bg-transparent text-sm focus:outline-none placeholder:text-placeholder placeholder:opacity-80 leading-7 font-medium disabled:opacity-50"
              />
            </div>
            <div className="flex-shrink-0">
              <button 
                type="submit"
                disabled={loading || !messageText.trim()}
                className="w-50px h-50px leading-50px bg-primaryColor text-whiteColor rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <i className="icofont-spinner animate-spin text-xl"></i>
                ) : (
                  <i className="icofont-arrow-right text-xl"></i>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Conversation;