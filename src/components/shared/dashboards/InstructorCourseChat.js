"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import Conversation from "./Conversation";
import CoversationPartner from "./CoversationPartner";

const InstructorCourseChat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [studentContacts, setStudentContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected, joinChat, leaveChat, sendMessage } = useSocket();

  useEffect(() => {
    fetchUserChats();
    fetchStudentContacts();
  }, []);

  // Socket.io event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (data) => {
      const { chatId, message, senderId, timestamp } = data;
      
      if (activeChat && activeChat._id === chatId) {
        setActiveChat(prev => ({
          ...prev,
          messages: [
            ...(prev.messages || []),
            {
              _id: Date.now().toString(),
              content: message.content || message.message,
              sender: { _id: senderId },
              timestamp: timestamp,
              attachments: message.attachments || []
            }
          ]
        }));
      }
      
      setChats(prev => prev.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            lastMessage: {
              content: message.content || message.message,
              sender: senderId,
              timestamp: timestamp
            },
            unreadCount: chat._id === activeChat?._id ? 0 : (chat.unreadCount || 0) + 1
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
    joinChat(activeChat._id);
    return () => {
      if (activeChat) leaveChat(activeChat._id);
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
          fetchChatMessages(firstChat._id);
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
        setStudentContacts(data.courseStudents || []);
      }
    } catch (error) {
      console.error('Error fetching student contacts:', error);
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
          const exists = prev.find(chat => chat._id === data.chat._id);
          if (!exists) {
            return [data.chat, ...prev];
          }
          return prev;
        });
        
        setActiveChat(data.chat);
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

  const handleChatSelect = (chat) => {
    console.log('Selected chat:', chat);
    setActiveChat(chat);
    // Immediately fetch messages for this chat
    fetchChatMessages(chat._id);
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
      
      // For now, send as JSON without file attachments
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${activeChat._id}/messages`, {
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
          sendMessage(activeChat._id, {
            message: messageText,
            attachments: attachments.map(file => ({ name: file.name, size: file.size }))
          }, getCurrentUserId());
        }
        
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
        console.log('Fetched messages for chat:', chatId, data);
        setActiveChat(prev => ({
          ...prev,
          messages: data.data?.messages || data.messages || []
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
          {showContacts ? 'Show Chats' : 'Message Students'}
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
                <div key={courseData._id} className="border-b last:border-b-0 pb-4 mb-4">
                  <h4 className="font-semibold text-primaryColor mb-3">
                    {courseData.title}
                  </h4>
                  <div className="space-y-2">
                    {courseData.students.map((student) => (
                      <div key={student._id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.profileImage || "/assets/images/dashbord/profile.png"}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-blackColor dark:text-blackColor-dark">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleStartChat(student._id, courseData._id)}
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
          onRefreshMessages={() => activeChat && fetchChatMessages(activeChat._id)}
        />
      </div>
    </div>
  );
};

export default InstructorCourseChat;