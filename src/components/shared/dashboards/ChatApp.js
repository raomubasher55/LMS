"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useUnreadMessagesContext } from "@/contexts/UnreadMessagesContext";
import Conversation from "./Conversation";
import CoversationPartner from "./CoversationPartner";

const ChatApp = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [instructorContacts, setInstructorContacts] = useState([]);
  const [showInstructorList, setShowInstructorList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected, joinChat, leaveChat, sendMessage } = useSocket();
  const { refetchUnreadCount } = useUnreadMessagesContext();

  useEffect(() => {
    fetchUserChats();
    fetchInstructorContacts();
  }, []);

  // Socket.io event listeners for real-time messaging
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new messages
    const handleNewMessage = (data) => {
      const { chatId, content, senderId, timestamp, attachments = [] } = data;
      
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

      const currentUserId = getCurrentUserId();
      
      // Only process messages from other users to avoid duplicates
      if (senderId === currentUserId) {
        return;
      }
      
      // Update the active chat if it matches
      if (activeChat && activeChat.chatId === chatId) {
        setActiveChat(prev => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.messages?.some(msg => 
            msg.sender?._id === senderId && 
            msg.content === content && 
            Math.abs(new Date(msg.timestamp) - new Date(timestamp)) < 1000
          );
          
          if (messageExists) {
            return prev;
          }
          
          return {
            ...prev,
            messages: [
              ...(prev.messages || []),
              {
                _id: `socket-${Date.now()}-${senderId}`,
                content,
                sender: { _id: senderId },
                timestamp,
                attachments
              }
            ]
          };
        });
      }
      
      // Update the chat list to show new message
      setChats(prev => prev.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            lastMessage: {
              content,
              sender: { _id: senderId },
              timestamp
            },
            unreadCount: chat.chatId === activeChat?.chatId ? 0 : (chat.unreadCount || 0) + 1
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

    joinChat(activeChat.chatId);

    return () => {
      if (activeChat) {
        leaveChat(activeChat.chatId);
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
        setChats(data.data || []);
        if (data.data?.length > 0) {
          setActiveChat(data.data[0]);
          fetchChatMessages(data.data[0]._id);
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

  const fetchInstructorContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/admin/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInstructorContacts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching instructor contacts:', error);
    }
  };

  const handleChatSelect = (chat) => {
    console.log('Selecting chat:', chat);
    if (!chat || !chat._id) {
      console.error('Cannot select chat: chat or chat._id is missing', { chat });
      setError('Invalid chat selected');
      return;
    }
    setActiveChat(chat);
    fetchChatMessages(chat._id);
  };

  const handleStartInstructorChat = async (instructorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantId: instructorId
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add to chats if it's a new chat
        setChats(prev => {
          const exists = prev.find(chat => chat._id === data.data.chatId);
          if (!exists) {
            return [data.data, ...prev];
          }
          return prev;
        });
        
        setActiveChat(data.data);
        setShowInstructorList(false);
        fetchChatMessages(data.data.chatId);
      } else {
        setError('Failed to start chat with instructor');
      }
    } catch (error) {
      console.error('Error starting instructor chat:', error);
      setError('Error starting instructor chat');
    }
  };

  const handleSendMessage = async (messageText, attachments = []) => {
    if (!activeChat || !activeChat.chatId || (!messageText.trim() && attachments.length === 0)) {
      console.error('Cannot send message: activeChat or activeChat.chatId is missing', { activeChat });
      return;
    }

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
      
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('content', messageText || '');
      
      // Add attachments if any
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${activeChat.chatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header for FormData, let browser set it
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // Send real-time message via Socket.io
        if (isConnected && socket) {
          sendMessage(activeChat.chatId, messageText || '', getCurrentUserId(), 
            data.data?.attachments || []
          );
        }
        
        // Add message to current chat immediately for instant feedback
        const tempMessageId = `temp-${Date.now()}-${getCurrentUserId()}`;
        setActiveChat(prev => ({
          ...prev,
          messages: [
            ...(prev.messages || []),
            {
              _id: data.data?._id || tempMessageId,
              content: messageText || '',
              sender: { _id: getCurrentUserId() },
              timestamp: data.data?.timestamp || new Date(),
              attachments: data.data?.attachments || [],
              isTemporary: !data.data?._id // Mark temporary messages
            }
          ]
        }));
        
        // Update the chat list to reflect latest message
        setChats(prev => prev.map(chat => {
          if (chat.chatId === activeChat.chatId) {
            return {
              ...chat,
              lastMessage: {
                content: messageText || '',
                sender: { _id: getCurrentUserId() },
                timestamp: new Date()
              }
            };
          }
          return chat;
        }));
        
        // Refresh unread count for recipient
        refetchUnreadCount();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchChatMessages = async (chatId, page = 1) => {
    if (!chatId || chatId === 'undefined') {
      console.error('Cannot fetch chat messages: chatId is invalid', { chatId });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${chatId}?page=${page}&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (page === 1) {
          // First page - replace messages and chat data
          setActiveChat(data.data);
        } else {
          // Subsequent pages - prepend messages
          setActiveChat(prev => ({
            ...prev,
            messages: [...data.data.messages, ...(prev.messages || [])],
            pagination: data.data.pagination
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const loadMoreMessages = async () => {
    if (!activeChat?.pagination?.hasMore || !activeChat?.chatId) {
      console.error('Cannot load more messages: invalid activeChat', { activeChat });
      return;
    }
    
    const nextPage = activeChat.pagination.currentPage + 1;
    await fetchChatMessages(activeChat.chatId, nextPage);
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
      <div className="mb-15px flex justify-between items-center">
        <h2 className="text-2xl md:text-size-28 font-bold text-blackColor dark:text-blackColor-dark">
          Messages
        </h2>
        <button
          onClick={() => setShowInstructorList(!showInstructorList)}
          className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90"
        >
          {showInstructorList ? 'Show Chats' : 'Message Instructors'}
        </button>
      </div>

      {/* Instructor List Modal */}
      {showInstructorList && (
        <div className="mb-6 p-4 bg-white dark:bg-whiteColor-dark rounded-lg border shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Select an Instructor to Message
          </h3>
          <div className="max-h-96 overflow-y-auto">
            {instructorContacts.length === 0 ? (
              <p className="text-gray-500">No instructors found.</p>
            ) : (
              <div className="space-y-2">
                {instructorContacts.map((instructor) => (
                  <div key={instructor._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <img
                        src={instructor.profile || "/assets/images/dashbord/profile.png"}
                        alt={instructor.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-blackColor dark:text-blackColor-dark">
                          {instructor.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {instructor.email}
                        </p>
                        <p className="text-xs text-primaryColor font-medium">
                          Instructor
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartInstructorChat(instructor._id)}
                      className="px-4 py-2 bg-primaryColor text-white rounded-lg text-sm hover:bg-primaryColor/90 transition-colors"
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowInstructorList(false)}
            className="mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

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
          onRefreshMessages={() => activeChat && fetchChatMessages(activeChat.chatId)}
          onLoadMoreMessages={loadMoreMessages}
        />
      </div>
    </div>
  );
};

export default ChatApp;