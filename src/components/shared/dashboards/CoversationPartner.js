"use client";
import { useState } from "react";
import Image from "next/image";
import { useSocket } from "@/contexts/SocketContext";
// Use a string path instead of static import to avoid blur placeholder issues
const defaultAvatar = "/assets/images/teacher/teacher__1.png";

const CoversationPartner = ({ chats = [], activeChat, onChatSelect, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const { isUserOnline } = useSocket();

  const getCurrentUserId = () => {
    // This would typically come from your auth context
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

  const filteredChats = chats.filter(chat => {
    if (!chat || !chat.participants || !Array.isArray(chat.participants)) {
      return false;
    }
    const otherParticipant = chat.participants.find(p => p && p._id !== getCurrentUserId());
    if (!otherParticipant) {
      return false;
    }
    const participantName = otherParticipant.name || 
                          `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim();
    if (!participantName) {
      return false;
    }
    return participantName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatLastSeen = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const getOtherParticipant = (chat) => {
    if (!chat || !chat.participants || !Array.isArray(chat.participants)) {
      return null;
    }
    const currentUserId = getCurrentUserId();
    return chat.participants.find(p => p && p._id !== currentUserId);
  };

  const getLastMessage = (chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const currentUserId = getCurrentUserId();
    const isCurrentUser = (chat.lastMessage.sender?._id || chat.lastMessage.senderId) === currentUserId;
    const prefix = isCurrentUser ? 'You: ' : '';
    
    return `${prefix}${chat.lastMessage.content || chat.lastMessage.message || 'Attachment'}`;
  };

  const startNewChat = async (participantId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantId: participantId
        })
      });

      if (response.ok) {
        const data = await response.json();
        onRefresh(); // Refresh the chat list
        onChatSelect(data.chat); // Select the new chat
        setShowNewChatModal(false);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="xl:col-start-1 xl:col-span-5">
      <div className="bg-whiteColor dark:bg-whiteColor-dark border border-borderColor dark:border-borderColor-dark rounded-lg2 max-h-150 overflow-auto">
        {/* heading */}
        <div className="text-size-22 px-30px py-15px bg-deepgreen dark:bg-deepgreen-dark text-whiteColor dark:text-whiteColor-dark leading-30px font-semibold flex justify-between items-center">
          <h5>Chats</h5>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="text-whiteColor hover:text-gray-200 text-lg"
            title="Start new chat"
          >
            <i className="icofont-plus"></i>
          </button>
        </div>
        
        {/* search participant */}
        <div className="p-30px">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="text-darkdeep4 flex items-center pl-5 border border-borderColor dark:border-borderColor-dark rounded-full">
              <i className="icofont-search-1 text-lg cursor-pointer"></i>
              <input
                type="text"
                placeholder="Search chats"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 pl-10px py-10px bg-transparent text-sm focus:outline-none placeholder:text-placeholder placeholder:opacity-80 leading-7 font-medium"
              />
            </div>
          </form>
        </div>

        {/* participant list */}
        <ul>
          {filteredChats.length === 0 ? (
            <li className="text-center py-8 px-4 text-gray-500 dark:text-gray-400">
              {chats.length === 0 ? 'No chats yet' : 'No chats match your search'}
            </li>
          ) : (
            filteredChats.map((chat) => {
              const otherParticipant = getOtherParticipant(chat);
              const isActive = (activeChat?.chatId || activeChat?._id) === (chat.chatId || chat._id);
              
              return (
                <li
                  key={chat._id}
                  className={`border-t border-borderColor dark:border-borderColor-dark ${
                    isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div 
                    className="cursor-pointer flex items-center flex-wrap py-15px px-30px max-w-435px w-full hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => onChatSelect(chat)}
                  >
                    {/* avatar */}
                    <div className="max-w-50px mr-5 relative">
                      {isUserOnline(otherParticipant?._id) && (
                        <span className="absolute left-[38px] bottom-0 w-15px h-15px bg-green-500 border-3px border-whiteColor dark:border-whiteColor-dark rounded-full"></span>
                      )}
                      {otherParticipant ? (
                        <Image
                          src={otherParticipant.profileImage || otherParticipant.profile || defaultAvatar}
                          alt={otherParticipant.name || 'User'}
                          className="w-full rounded-full"
                          width={50}
                          height={50}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs">?</span>
                        </div>
                      )}
                    </div>
                    {/* details */}
                    <div className="flex-grow min-w-0">
                      <div>
                        <h5 className="text-lg font-medium text-blackColor dark:text-blackColor-dark flex items-center justify-between">
                          <span className="leading-6 truncate">
                            {otherParticipant?.name || 
                             `${otherParticipant?.firstName || ''} ${otherParticipant?.lastName || ''}`.trim() || 
                             'Unknown User'}
                          </span>
                          <span className="text-sm text-darkdeep4 font-inter leading-6 font-normal flex-shrink-0 ml-2">
                            {formatLastSeen(chat.lastMessage?.timestamp || chat.lastMessage?.createdAt)}
                          </span>
                        </h5>
                        <p className="text-sm text-darkdeep4 text-start leading-6 truncate">
                          {getLastMessage(chat)}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="inline-block bg-primaryColor text-white text-xs rounded-full px-2 py-1 mt-1">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-90vw">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Start New Chat</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="icofont-close text-xl"></i>
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Search for instructors or students to start a conversation.
            </p>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-primaryColor focus:border-primaryColor dark:bg-gray-700"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoversationPartner;