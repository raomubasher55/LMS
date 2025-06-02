"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useUnreadMessagesContext } from "@/contexts/UnreadMessagesContext";
import Conversation from "./Conversation";
import CoversationPartner from "./CoversationPartner";

const StudentCourseChat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [instructorContacts, setInstructorContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected, joinChat, leaveChat, sendMessage } = useSocket();
  const { refetchUnreadCount } = useUnreadMessagesContext();

  useEffect(() => {
    fetchUserChats();
    fetchInstructorContacts();
  }, []);

  // Socket.io event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

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
          
          const newMessages = [
            ...(prev.messages || []),
            {
              _id: `socket-${Date.now()}-${senderId}`,
              content,
              sender: { _id: senderId },
              timestamp,
              attachments
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
      
      // Refresh chat list to get any new chats
      fetchUserChats();
    };

    socket.on('new_message', handleNewMessage);
    return () => socket.off('new_message', handleNewMessage);
  }, [socket, isConnected, activeChat]);

  useEffect(() => {
    if (!activeChat || !isConnected) return;
    joinChat(activeChat.chatId);
    return () => {
      if (activeChat) leaveChat(activeChat.chatId);
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
        console.log('Student chats response:', data);
        setChats(data.data || []);
        if (data.data?.length > 0) {
          const firstChat = data.data[0];
          setActiveChat(firstChat);
          // Fetch messages for the first chat
          fetchChatMessages(firstChat.chatId || firstChat._id);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/student/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Instructor contacts response:', data);
        setInstructorContacts(data.instructors || []);
      } else {
        console.error('Failed to fetch instructor contacts:', response.status);
        const errorData = await response.text();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching instructor contacts:', error);
    }
  };

  const handleStartChat = async (instructorId, courseId) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to start a chat');
        return;
      }
      
      if (!instructorId || !courseId) {
        setError('Missing instructor or course information');
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/course-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instructorId,
          courseId
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Course chat response:', data);
        
        // Add to chats if it's a new chat
        setChats(prev => {
          const exists = prev.find(chat => chat._id === data.data._id);
          if (!exists) {
            return [data.data, ...prev];
          }
          return prev;
        });
        
        setActiveChat(data.data);
        setShowContacts(false);
      } else {
        // Handle specific error cases
        const errorMessage = data.message || 'Failed to start chat with instructor';
        
        if (response.status === 403) {
          if (data.message.includes('not enrolled')) {
            setError('You need to enroll in this course first to message the instructor.');
          } else if (data.message.includes('unpublished')) {
            setError('This course is not yet available for chat.');
          } else {
            setError(errorMessage);
          }
        } else if (response.status === 404) {
          setError('Instructor or course not found.');
        } else if (response.status === 400) {
          setError('Invalid request. Please try again.');
        } else {
          setError(errorMessage);
        }
        
        console.error('Chat creation failed:', data);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat) => {
    console.log('Selected chat:', chat);
    if (!chat || !(chat.chatId || chat._id)) {
      console.error('Cannot select chat: chat or chat.chatId is missing', { chat });
      setError('Invalid chat selected');
      return;
    }
    setActiveChat(chat);
    // Immediately fetch messages for this chat
    fetchChatMessages(chat.chatId || chat._id);
    
    // Reset unread count for this specific chat
    setChats(prev => prev.map(c => 
      (c.chatId || c._id) === (chat.chatId || chat._id) 
        ? { ...c, unreadCount: 0 }
        : c
    ));
  };

  const handleSendMessage = async (messageText, attachments = []) => {
    if (!activeChat || !activeChat.chatId || !messageText.trim()) {
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
      
      // For now, send as JSON without file attachments
      // TODO: Implement file upload handling later
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${activeChat.chatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: messageText,
          attachments: [] // TODO: Handle file attachments
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (isConnected && socket) {
          sendMessage(activeChat.chatId, {
            content: messageText,
            attachments: []
          }, getCurrentUserId());
        }
        
        setActiveChat(prev => {
          const newMessages = [
            ...(prev.messages || []),
            {
              _id: data.data?._id || Date.now().toString(),
              content: messageText,
              sender: { _id: getCurrentUserId() },
              timestamp: new Date(),
              attachments: data.data?.attachments || []
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
        
        setChats(prev => prev.map(chat => {
          if (chat.chatId === activeChat.chatId) {
            return {
              ...chat,
              lastMessage: {
                content: messageText,
                sender: getCurrentUserId(),
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
        console.log('Fetched messages for chat:', chatId, data);
        const messages = data.data?.messages || data.messages || [];
        // Sort messages chronologically (oldest first)
        messages.sort((a, b) => {
          const timeA = new Date(a.timestamp || a.createdAt);
          const timeB = new Date(b.timestamp || b.createdAt);
          return timeA - timeB;
        });
        
        setActiveChat(prev => ({
          ...prev,
          messages: messages
        }));
      } else {
        console.error('Failed to fetch messages:', response.status);
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
      <div className="mb-15px flex justify-between items-center">
        <h2 className="text-2xl md:text-size-28 font-bold text-blackColor dark:text-blackColor-dark">
          Messages
        </h2>
        <button
          onClick={() => setShowContacts(!showContacts)}
          className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90"
        >
          {showContacts ? 'Show Chats' : 'New Message'}
        </button>
      </div>

      {/* Instructor Contacts Modal */}
      {showContacts && (
        <div className="mb-6 p-4 bg-white dark:bg-whiteColor-dark rounded-lg border shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Message Your Instructors
          </h3>
          <div className="max-h-60 overflow-y-auto">
            {instructorContacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No instructors available. Enroll in courses to message instructors.</p>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/debug/enrollment`, {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      });
                      const data = await response.json();
                      console.log('Debug enrollment data:', data);
                      alert(`Purchased: ${data.purchasedCount}, Enrolled: ${data.enrolledCount}. Check console for details.`);
                    } catch (error) {
                      console.error('Debug error:', error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Debug Enrollment
                </button>
              </div>
            ) : (
              instructorContacts.map((instructor) => (
                <div key={instructor._id} className="border-b last:border-b-0 pb-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={instructor.profileImage || "/assets/images/dashbord/profile.png"}
                        alt={instructor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-blackColor dark:text-blackColor-dark">
                          {instructor.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Instructor
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Courses you're enrolled in:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {instructor.courses.map((course) => (
                        <button
                          key={course._id}
                          onClick={() => handleStartChat(instructor._id, course._id)}
                          className="px-3 py-1 bg-primaryColor/10 text-primaryColor rounded-full text-sm hover:bg-primaryColor/20"
                        >
                          {course.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setShowContacts(false)}
            className="mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-30px">
        <CoversationPartner 
          chats={chats}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          onRefresh={fetchUserChats}
        />
        <Conversation 
          activeChat={activeChat}
          onSendMessage={handleSendMessage}
          onRefreshMessages={() => activeChat && fetchChatMessages(activeChat.chatId)}
        />
      </div>
    </div>
  );
};

export default StudentCourseChat;