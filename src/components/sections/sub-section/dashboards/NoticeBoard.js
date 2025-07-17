"use client";
import { useState, useEffect, useRef } from 'react';
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import Image from "next/image";
import Link from "next/link";
import TranslatedText from '@/components/shared/TranslatedText';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ws = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const markNoticeAsRead = async (noticeId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/notices/${noticeId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notice as read');
      }

      // Update local state to reflect read status
      setNotices(prevNotices => 
        prevNotices.map(notice => 
          notice._id === noticeId ? { ...notice, isRead: true } : notice
        )
      );
    } catch (err) {
      console.error('Error marking notice as read:', err);
    }
  };

  const fetchNotices = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/notices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) throw new Error('Unauthorized - Please login again');
      if (!response.ok) throw new Error(`Failed to fetch notices: ${response.statusText}`);

      const data = await response.json();
      setNotices(data.slice(0, 5));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load notices');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotices();

    // Set up WebSocket connection
    const token = getAuthToken();
    if (token) {
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000'}?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connected for notices');
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'notices') {
          setNotices(message.data.slice(0, 5));
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
      };
    }

    // Polling fallback every minute
    const interval = setInterval(fetchNotices, 60000);

    return () => {
      clearInterval(interval);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-green-500';
    }
  };

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
        <HeadingDashboard path="/admin/notices"><TranslatedText>Tableau d'affichage</TranslatedText></HeadingDashboard>
        <div className="flex justify-center py-10">
          <p>Loading notices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
        <HeadingDashboard path="/admin/notices"><TranslatedText>Tableau d'affichage</TranslatedText></HeadingDashboard>
        <div className="text-red-500 p-4">
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          {(typeof error === 'string' ? error : error?.message || '').includes('Unauthorized') && (
            <Link href="/admin/login" className="block mt-2 text-blue-500 hover:underline">
              <TranslatedText>Aller à la page de connexion</TranslatedText>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
      <HeadingDashboard path="/admin/notices">Notice Board</HeadingDashboard>
      <ul>
        {notices.length > 0 ? (
          notices.map((notice) => (
            <li 
              key={notice._id} 
              className={`flex items-center flex-wrap pt-5 border-l-4 ${getPriorityColor(notice.priority)} pl-3 ${notice.isRead ? 'opacity-75' : 'bg-blue-50 dark:bg-gray-800'}`}
              onClick={() => !notice.isRead && markNoticeAsRead(notice._id)}
            >
              <div className="w-full md:w-30% md:pr-5">
                <Link className="w-full" href={`/admin/notices/${notice._id}`}>
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded flex items-center justify-center">
                    {notice.imageUrl ? (
                      <Image 
                        src={notice.imageUrl} 
                        alt={notice.title}
                        width={80}
                        height={60}
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="text-2xl">
                        {notice.type === 'system' && '⚠️'}
                        {notice.type === 'enrollment' && '👥'}
                        {notice.type === 'financial' && '💰'}
                        {notice.type === 'course' && '📚'}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              <div className="w-full md:w-70% md:pr-5">
                <div>
                  <h5 className="text-lg leading-1.5 font-medium text-contentColor dark:text-contentColor-dark mb-1">
                    <Link className="hover:text-primaryColor" href={`/admin/notices/${notice._id}`}>
                      {notice.title}
                    </Link>
                  </h5>
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(notice.createdAt).toLocaleString()}
                    {notice.isRead && <span className="ml-2 text-xs text-green-500">✓ Read</span>}
                  </p>
                  {notice.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {notice.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="py-4 text-center text-gray-500">
            No notices available
          </li>
        )}
      </ul>
    </div>
  );
};

export default NoticeBoard;