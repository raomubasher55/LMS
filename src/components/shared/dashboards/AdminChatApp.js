"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useUnreadMessagesContext } from "@/contexts/UnreadMessagesContext";
import Conversation from "./Conversation";
import TranslatedText from "../TranslatedText";

const AdminChatApp = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [instructorContacts, setInstructorContacts] = useState([]);
  const [studentContacts, setStudentContacts] = useState([]);
  const [showInstructorList, setShowInstructorList] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
  const [contactType, setContactType] = useState('instructors'); // 'instructors' or 'students'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected, joinChat, leaveChat, sendMessage } = useSocket();
  const { refetchUnreadCount } = useUnreadMessagesContext();

  useEffect(() => {
    fetchUserChats();
    fetchInstructorContacts();
    fetchStudentContacts();
  }, []);

  // Socket.io event listeners for real-time messaging
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new messages
    const handleNewMessage = (data) => {
      const { chatId, content, senderId, timestamp } = data;
      
      console.log('AdminChatApp: Received socket message', data);
      
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
        console.log('AdminChatApp: Ignoring own message from socket');
        return;
      }
      
      // Update the active chat if it matches
      if (activeChat && (activeChat.chatId || activeChat._id) === chatId) {
        setActiveChat(prev => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.messages?.some(msg => 
            msg.sender?._id === senderId && 
            msg.content === content && 
            Math.abs(new Date(msg.timestamp) - new Date(timestamp)) < 1000
          );
          
          if (messageExists) {
            console.log('AdminChatApp: Message already exists, skipping');
            return prev;
          }
          
          console.log('AdminChatApp: Adding message from socket to active chat');
          const newMessages = [
            ...(prev.messages || []),
            {
              _id: `socket-${Date.now()}-${senderId}`,
              content,
              sender: { _id: senderId },
              timestamp
            }
          ];
          
          // Sort messages chronologically (oldest first)
          newMessages.sort((a, b) => {
            const timeA = new Date(a.timestamp || a.createdAt);
            const timeB = new Date(b.timestamp || b.createdAt);
            return timeA - timeB;
          });
          
          return {
            ...prev,
            messages: newMessages
          };
        });
      }
      
      // Update the chat list to show new message
      setChats(prev => prev.map(chat => {
        if ((chat.chatId || chat._id) === chatId) {
          const updatedChat = {
            ...chat,
            lastMessage: {
              content,
              sender: { _id: senderId },
              timestamp
            },
            unreadCount: (chat.chatId || chat._id) === (activeChat?.chatId || activeChat?._id) ? 0 : (chat.unreadCount || 0) + 1
          };
          console.log('AdminChatApp: Updated chat unread count:', {
            chatId: chat._id,
            participant: chat.participants?.find(p => p._id !== getCurrentUserId())?.firstName,
            previousUnread: chat.unreadCount,
            newUnread: updatedChat.unreadCount,
            isActiveChat: (chat.chatId || chat._id) === (activeChat?.chatId || activeChat?._id)
          });
          return updatedChat;
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

    joinChat(activeChat.chatId || activeChat._id);

    return () => {
      if (activeChat) {
        leaveChat(activeChat.chatId || activeChat._id);
      }
    };
  }, [activeChat, isConnected, joinChat, leaveChat]);

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
        console.log('AdminChatApp: Fetched chats data:', data);
        console.log('AdminChatApp: Individual chat unread counts:', data.data?.map(chat => ({
          id: chat._id,
          participant: chat.participants?.find(p => p._id !== getCurrentUserId())?.firstName,
          unreadCount: chat.unreadCount
        })));
        // Initialize unreadCount if not provided by backend
        const chatsWithUnreadCount = (data.data || []).map(chat => ({
          ...chat,
          unreadCount: chat.unreadCount || 0
        }));
        setChats(chatsWithUnreadCount);
        if (data.data?.length > 0) {
          console.log('AdminChatApp: Setting active chat to first chat:', data.data[0]);
          setActiveChat(data.data[0]);
        } else {
          console.log('AdminChatApp: No chats found in response');
        }
      } else {
        console.error('Failed to fetch chats, response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Failed to load chats');
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
      } else {
        console.error('Failed to fetch instructor contacts');
      }
    } catch (error) {
      console.error('Error fetching instructor contacts:', error);
    }
  };

  const fetchStudentContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      // Get all students - we might need to create this endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentContacts(data.data || []);
      } else {
        console.error('Failed to fetch student contacts');
      }
    } catch (error) {
      console.error('Error fetching student contacts:', error);
    }
  };

  const startChatWithUser = async (userId, userType) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantId: userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('AdminChatApp: Chat creation response:', data);
        
        // Add to chats if it's a new chat
        setChats(prev => {
          const exists = prev.find(chat => chat._id === data.data._id);
          if (!exists) {
            return [data.data, ...prev];
          }
          return prev;
        });
        
        console.log('AdminChatApp: Setting activeChat to:', data.data);
        setActiveChat(data.data);
        setShowInstructorList(false);
        setShowStudentList(false);
        
        if (data.data.chatId || data.data._id) {
          fetchChatMessages(data.data.chatId || data.data._id);
        } else {
          console.error('AdminChatApp: New chat does not have _id:', data.data);
        }
      } else {
        setError(`Failed to start chat with ${userType}`);
      }
    } catch (error) {
      console.error(`Error starting ${userType} chat:`, error);
      setError(`Error starting ${userType} chat`);
    }
  };

  const fetchChatMessages = async (chatId) => {
    if (!chatId || chatId === 'undefined') {
      console.error('Cannot fetch chat messages: chatId is invalid', { chatId });
      return;
    }
    
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
        // Ensure messages are sorted chronologically (oldest first)
        if (data.data && data.data.messages) {
          data.data.messages.sort((a, b) => {
            const timeA = new Date(a.timestamp || a.createdAt);
            const timeB = new Date(b.timestamp || b.createdAt);
            return timeA - timeB;
          });
        }
        setActiveChat(data.data);
      } else {
        console.error('Failed to fetch chat messages');
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleSendMessage = async (messageText) => {
    console.log('AdminChatApp: handleSendMessage called', { 
      activeChat, 
      activeChat_id: activeChat?.chatId,
      messageText
    });
    
    if (!activeChat || !(activeChat.chatId || activeChat._id) || !messageText.trim()) {
      console.error('Cannot send message: activeChat or activeChat.chatId is missing', { 
        activeChat,
        hasActiveChat: !!activeChat,
        activeChatId: activeChat?.chatId,
        activeChatKeys: activeChat ? Object.keys(activeChat) : 'none',
        messageText
      });
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
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${activeChat.chatId || activeChat._id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: messageText })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('AdminChatApp: Message sent successfully, backend response:', data);
        
        // Send real-time message via Socket.io
        if (isConnected && socket) {
          sendMessage(activeChat.chatId || activeChat._id, messageText || '', getCurrentUserId(), 
            data.data?.attachments || []
          );
        }
        
        // Add message to current chat immediately for instant feedback
        const newMessage = {
          _id: data.data?._id || `temp-${Date.now()}`,
          content: messageText || '',
          sender: { _id: getCurrentUserId() },
          timestamp: data.data?.timestamp || new Date(),
          attachments: data.data?.attachments || []
        };
        
        console.log('AdminChatApp: Adding new message to chat', newMessage);
        
        setActiveChat(prev => {
          const newMessages = [...(prev.messages || []), newMessage];
          
          // Sort messages chronologically (oldest first)
          newMessages.sort((a, b) => {
            const timeA = new Date(a.timestamp || a.createdAt);
            const timeB = new Date(b.timestamp || b.createdAt);
            return timeA - timeB;
          });
          
          return {
            ...prev,
            messages: newMessages
          };
        });
        
        // Update the chat list to reflect latest message
        setChats(prev => prev.map(chat => {
          if (chat._id === activeChat._id) {
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
        
        // Force refresh messages to ensure consistency
        setTimeout(() => {
          fetchChatMessages(activeChat.chatId || activeChat._id);
        }, 500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const refreshMessages = () => {
    if (activeChat) {
      fetchChatMessages(activeChat.chatId || activeChat._id);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading chats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-30px">
        <div className="xl:col-span-5">
          <div className="p-10px bg-whiteColor dark:bg-whiteColor-dark rounded-lg2">
            {/* Header with contact type selector */}
            <div className="flex items-center justify-between mb-4 p-4 border-b">
              <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
                <TranslatedText>Messages d'administration</TranslatedText>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setContactType('instructors')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    contactType === 'instructors'
                      ? 'bg-primaryColor text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <TranslatedText>Formateurs</TranslatedText>
                </button>
                <button
                  onClick={() => setContactType('students')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    contactType === 'students'
                      ? 'bg-primaryColor text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <TranslatedText>Étudiants</TranslatedText>
                </button>
              </div>
            </div>

            {/* Start new chat buttons */}
            <div className="mb-4 space-y-2">
              {contactType === 'instructors' && (
                <button
                  onClick={() => setShowInstructorList(!showInstructorList)}
                  className="w-full bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-primaryColor/90 transition-colors"
                >
                  {showInstructorList ? 'Hide' : 'Message'} <TranslatedText>Formateurs</TranslatedText>
                </button>
              )}
              
              {contactType === 'students' && (
                <button
                  onClick={() => setShowStudentList(!showStudentList)}
                  className="w-full bg-secondaryColor text-white px-4 py-2 rounded-md hover:bg-secondaryColor/90 transition-colors"
                >
                  {showStudentList ? 'Hide' : 'Message'} <TranslatedText>Étudiants</TranslatedText>
                </button>
              )}
            </div>

            {/* Contact Lists */}
            {showInstructorList && contactType === 'instructors' && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md max-h-60 overflow-y-auto">
                <h4 className="font-medium mb-2 text-blackColor dark:text-blackColor-dark"><TranslatedText>Sélectionner un formateur</TranslatedText>:</h4>
                {instructorContacts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400"><TranslatedText>Aucun formateur disponible</TranslatedText></p>
                ) : (
                  instructorContacts.map((instructor) => (
                    <button
                      key={instructor._id}
                      onClick={() => startChatWithUser(instructor._id, 'instructor')}
                      className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-blackColor dark:text-blackColor-dark">
                            {instructor.firstName} {instructor.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400"><TranslatedText>Formateur</TranslatedText></p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {showStudentList && contactType === 'students' && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md max-h-60 overflow-y-auto">
                <h4 className="font-medium mb-2 text-blackColor dark:text-blackColor-dark"><TranslatedText>Sélectionner un étudiant</TranslatedText>:</h4>
                {studentContacts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400"><TranslatedText>Aucun étudiant disponible</TranslatedText></p>
                ) : (
                  studentContacts.map((student) => (
                    <button
                      key={student._id}
                      onClick={() => startChatWithUser(student._id, 'student')}
                      className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-blackColor dark:text-blackColor-dark">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400"><TranslatedText>Étudiant</TranslatedText></p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Existing Chats */}
            <div className="space-y-2">
              <h4 className="font-medium text-blackColor dark:text-blackColor-dark"><TranslatedText>Discussions récentes</TranslatedText>:</h4>
              {chats.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 p-4 text-center">
                  <TranslatedText>Aucune conversation pour le moment. Commencez une nouvelle discussion ci-dessus.</TranslatedText>
                </p>
              ) : (
                chats.map((chat) => {
                  const otherParticipant = chat.participants?.find(p => p._id !== getCurrentUserId());
                  const isActive = (activeChat?.chatId || activeChat?._id) === (chat.chatId || chat._id);
                  
                  return (
                    <div
                      key={chat._id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        isActive 
                          ? 'bg-primaryColor/10 border border-primaryColor/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => {
                        console.log('AdminChatApp: Selecting chat', chat);
                        if (chat && (chat.chatId || chat._id)) {
                          setActiveChat(chat);
                          fetchChatMessages(chat.chatId || chat._id);
                          
                          // Reset unread count for this specific chat
                          setChats(prev => prev.map(c => {
                            if ((c.chatId || c._id) === (chat.chatId || chat._id)) {
                              console.log('AdminChatApp: Resetting unread count for chat:', {
                                chatId: c._id,
                                participant: c.participants?.find(p => p._id !== getCurrentUserId())?.firstName,
                                previousUnread: c.unreadCount,
                                newUnread: 0
                              });
                              return { ...c, unreadCount: 0 };
                            }
                            return c;
                          }));
                        } else {
                          console.error('AdminChatApp: Invalid chat object', chat);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                          {otherParticipant?.firstName?.charAt(0) || '?'}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-medium text-blackColor dark:text-blackColor-dark truncate">
                            {otherParticipant 
                              ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim()
                              : 'Unknown User'
                            }
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {chat.lastMessage?.content || 'No messages yet'}
                          </p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <span className="bg-primaryColor text-white text-xs rounded-full px-2 py-1">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        <Conversation
          activeChat={activeChat}
          onSendMessage={handleSendMessage}
          onRefreshMessages={refreshMessages}
          onLoadMoreMessages={() => {
            // Implement pagination if needed
            console.log('AdminChatApp: Load more messages requested');
          }}
        />
      </div>
    </div>
  );
};

export default AdminChatApp;