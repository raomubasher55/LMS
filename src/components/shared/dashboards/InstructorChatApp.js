"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useUnreadMessagesContext } from "@/contexts/UnreadMessagesContext";
import Conversation from "./Conversation";
import TranslatedText from "../TranslatedText";

const InstructorChatApp = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [studentContacts, setStudentContacts] = useState([]);
  const [adminContacts, setAdminContacts] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showAdminList, setShowAdminList] = useState(false);
  const [contactType, setContactType] = useState('students'); // 'students' or 'admins'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected, joinChat, leaveChat, sendMessage } = useSocket();
  const { refetchUnreadCount } = useUnreadMessagesContext();

  useEffect(() => {
    fetchUserChats();
    fetchStudentContacts();
    fetchAdminContacts();
  }, []);

  // Socket.io event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (data) => {
      const { chatId, content, senderId, timestamp } = data;
      
      const currentUserId = getCurrentUserId();
      
      // Only process messages from other users to avoid duplicates
      if (senderId === currentUserId) {
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
            return prev;
          }
          
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
      
      // Update chat list
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
          console.log('InstructorChatApp: Updated chat unread count:', {
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
        console.log('InstructorChatApp: Fetched chats data:', data);
        console.log('InstructorChatApp: Individual chat unread counts:', data.data?.map(chat => ({
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
          console.log('InstructorChatApp: Setting active chat to first chat:', data.data[0]);
          setActiveChat(data.data[0]);
        } else {
          console.log('InstructorChatApp: No chats found in response');
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

  const fetchStudentContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/instructor/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentContacts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching student contacts:', error);
    }
  };

  const fetchAdminContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/instructor/admin-contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminContacts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching admin contacts:', error);
    }
  };

  const startChatWithUser = async (userId, userType, courseId = null) => {
    try {
      const token = localStorage.getItem('token');
      
      let url, body;
      if (userType === 'student' && courseId) {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/course-chat`;
        body = { studentId: userId, courseId };
      } else {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats`;
        body = { participantId: userId };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('InstructorChatApp: New chat created:', data);
        
        // Add to chats if it's a new chat
        setChats(prev => {
          const chatId = data.data?.chatId || data.data?._id;
          const exists = prev.find(chat => (chat.chatId || chat._id) === chatId);
          if (!exists) {
            return [data.data, ...prev];
          }
          return prev;
        });
        
        setActiveChat(data.data);
        setShowStudentList(false);
        setShowAdminList(false);
        
        if (data.data.chatId || data.data._id) {
          fetchChatMessages(data.data.chatId || data.data._id);
        } else {
          console.error('InstructorChatApp: New chat does not have chatId:', data.data);
        }
      } else {
        console.error(`Failed to start ${userType} chat, status:`, response.status);
        setError(`Failed to start ${userType} chat`);
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
    console.log('InstructorChatApp: handleSendMessage called', { 
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
        console.log('InstructorChatApp: Message sent successfully, backend response:', data);
        
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
          timestamp: new Date().toISOString(),
          attachments: data.data?.attachments || []
        };
        
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
        
        // Update chat list
        setChats(prev => prev.map(chat => {
          if ((chat.chatId || chat._id) === activeChat.chatId) {
            return {
              ...chat,
              lastMessage: {
                content: messageText || 'Attachment',
                sender: { _id: getCurrentUserId() },
                timestamp: new Date().toISOString()
              }
            };
          }
          return chat;
        }));
        
        // Force refresh messages to ensure consistency
        setTimeout(() => {
          fetchChatMessages(activeChat.chatId || activeChat._id);
        }, 500);
      } else {
        console.error('Failed to send message, status:', response.status);
        setError('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message');
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
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
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
               <TranslatedText>Messages de l'instructeur</TranslatedText>
              </h3>
              <div className="flex gap-2">
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
                <button
                  onClick={() => setContactType('admins')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    contactType === 'admins'
                      ? 'bg-primaryColor text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <TranslatedText>Administrateurs</TranslatedText>
                </button>
              </div>
            </div>

            {/* Start new chat buttons */}
            <div className="mb-4 space-y-2">
              {contactType === 'students' && (
                <button
                  onClick={() => setShowStudentList(!showStudentList)}
                  className="w-full bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-primaryColor/90 transition-colors"
                >
                  {showStudentList ? 'Hide' : 'Message'} <TranslatedText>Étudiants</TranslatedText>

                </button>
              )}
              
              {contactType === 'admins' && (
                <button
                  onClick={() => setShowAdminList(!showAdminList)}
                  className="w-full bg-secondaryColor text-white px-4 py-2 rounded-md hover:bg-secondaryColor/90 transition-colors"
                >
                  {showAdminList ? 'Hide' : 'Message'} <TranslatedText>Administrateurs</TranslatedText>
                </button>
              )}
            </div>

            {/* Student Contact Lists */}
            {showStudentList && contactType === 'students' && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md max-h-60 overflow-y-auto">
                <h4 className="font-medium mb-2 text-blackColor dark:text-blackColor-dark"><TranslatedText>Sélectionner un étudiant</TranslatedText>:</h4>
                {studentContacts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400"><TranslatedText>Aucun étudiant disponible</TranslatedText></p>
                ) : (
                  studentContacts.map((courseData) => (
                    <div key={courseData.course._id} className="border-b last:border-b-0 pb-4 mb-4">
                      <h4 className="font-semibold text-primaryColor mb-3">
                        {courseData.course.title}
                      </h4>
                      <div className="space-y-2">
                        {courseData.students.map((student) => (
                          <button
                            key={student._id}
                            onClick={() => startChatWithUser(student._id, 'student', courseData.course._id)}
                            className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                              <div>
                                <p className="font-medium text-blackColor dark:text-blackColor-dark">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400"><TranslatedText> étudiant</TranslatedText></p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Admin Contact Lists */}
            {showAdminList && contactType === 'admins' && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md max-h-60 overflow-y-auto">
                <h4 className="font-medium mb-2 text-blackColor dark:text-blackColor-dark"><TranslatedText>Sélectionner un administrateur</TranslatedText>:</h4>
                {adminContacts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400"><TranslatedText>Aucun administrateur disponible</TranslatedText></p>
                ) : (
                  adminContacts.map((admin) => (
                    <button
                      key={admin._id}
                      onClick={() => startChatWithUser(admin._id, 'admin')}
                      className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-blackColor dark:text-blackColor-dark">
                            {admin.fullName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400"><TranslatedText>administrateur</TranslatedText></p>
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
                  const isActive = activeChat?.chatId === chat.chatId || activeChat?._id === chat._id;
                  
                  return (
                    <div
                      key={chat._id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        isActive 
                          ? 'bg-primaryColor/10 border border-primaryColor/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => {
                        console.log('InstructorChatApp: Selecting chat', chat);
                        if (chat && (chat.chatId || chat._id)) {
                          setActiveChat(chat);
                          fetchChatMessages(chat.chatId || chat._id);
                          
                          // Reset unread count for this specific chat
                          setChats(prev => prev.map(c => {
                            if ((c.chatId || c._id) === (chat.chatId || chat._id)) {
                              console.log('InstructorChatApp: Resetting unread count for chat:', {
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
                          console.error('InstructorChatApp: Invalid chat object', chat);
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
            console.log('InstructorChatApp: Load more messages requested');
          }}
        />
      </div>
    </div>
  );
};

export default InstructorChatApp;