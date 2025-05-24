"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import Conversation from "./Conversation";
import CoversationPartner from "./CoversationPartner";

const InstructorCourseChat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [studentContacts, setStudentContacts] = useState([]);
  const [adminContacts, setAdminContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [showAdminContacts, setShowAdminContacts] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chatType, setChatType] = useState('students'); // 'students' or 'admins'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected, joinChat, leaveChat, sendMessage } = useSocket();

  useEffect(() => {
    fetchUserChats();
    fetchStudentContacts();
    fetchAdminContacts();
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
        console.log('Instructor chats response:', data);
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

  const handleStartChat = async (studentId, courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/course-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId,
          courseId
        })
      });

      if (response.ok) {
        const data = await response.json();
        
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
        setSelectedCourse(null);
      } else {
        setError('Failed to start chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Error starting chat');
    }
  };

  const handleStartAdminChat = async (adminId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantId: adminId
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
        setShowAdminContacts(false);
        fetchChatMessages(data.data.chatId || data.data._id);
      } else {
        setError('Failed to start admin chat');
      }
    } catch (error) {
      console.error('Error starting admin chat:', error);
      setError('Error starting admin chat');
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${activeChat.chatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: messageText,
          attachments: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (isConnected && socket) {
          sendMessage(activeChat.chatId, {
            message: messageText,
            attachments: attachments.map(file => ({ name: file.name, size: file.size }))
          }, getCurrentUserId());
        }
        
        setActiveChat(prev => {
          const newMessages = [
            ...(prev.messages || []),
            {
              _id: data.message?._id || Date.now().toString(),
              message: messageText,
              senderId: getCurrentUserId(),
              createdAt: new Date(),
              attachments: data.message?.attachments || []
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
        <div className="flex gap-2">
          <button
            onClick={() => {
              setChatType('students');
              setShowContacts(!showContacts);
              setShowAdminContacts(false);
            }}
            className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90"
          >
            {showContacts && chatType === 'students' ? 'Show Chats' : 'Message Students'}
          </button>
          <button
            onClick={() => {
              setChatType('admins');
              setShowAdminContacts(!showAdminContacts);
              setShowContacts(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600/90"
          >
            {showAdminContacts ? 'Show Chats' : 'Message Admins'}
          </button>
        </div>
      </div>

      {/* Chat Type Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setChatType('students')}
          className={`px-4 py-2 rounded-lg font-medium ${
            chatType === 'students'
              ? 'bg-primaryColor text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Student Chats
        </button>
        <button
          onClick={() => setChatType('admins')}
          className={`px-4 py-2 rounded-lg font-medium ${
            chatType === 'admins'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Admin Chats
        </button>
      </div>

      {/* Student Contacts Modal */}
      {showContacts && (
        <div className="mb-6 p-4 bg-white dark:bg-whiteColor-dark rounded-lg border shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Message Your Students
          </h3>
          <div className="max-h-96 overflow-y-auto">
            {studentContacts.length === 0 ? (
              <p className="text-gray-500">No students found. Students will appear here once they enroll in your courses.</p>
            ) : (
              studentContacts.map((courseData) => (
                <div key={courseData.course._id} className="border-b last:border-b-0 pb-4 mb-4">
                  <h4 className="font-semibold text-primaryColor mb-3">
                    {courseData.course.title}
                  </h4>
                  <div className="space-y-2">
                    {courseData.students.map((student) => (
                      <div key={student._id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.profile || "/assets/images/dashbord/profile.png"}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-blackColor dark:text-blackColor-dark">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleStartChat(student._id, courseData.course._id)}
                          className="px-3 py-1 bg-primaryColor text-white rounded text-sm hover:bg-primaryColor/90"
                        >
                          Message
                        </button>
                      </div>
                    ))}
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

      {/* Admin Contacts Modal */}
      {showAdminContacts && (
        <div className="mb-6 p-4 bg-white dark:bg-whiteColor-dark rounded-lg border shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Message Administrators
          </h3>
          <div className="max-h-96 overflow-y-auto">
            {adminContacts.length === 0 ? (
              <p className="text-gray-500">No administrators found.</p>
            ) : (
              <div className="space-y-2">
                {adminContacts.map((admin) => (
                  <div key={admin._id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <div className="flex items-center gap-3">
                      <img
                        src={admin.profile || "/assets/images/dashbord/profile.png"}
                        alt={admin.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-blackColor dark:text-blackColor-dark">
                          {admin.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {admin.email}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          Administrator
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartAdminChat(admin._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-600/90"
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowAdminContacts(false)}
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

export default InstructorCourseChat;