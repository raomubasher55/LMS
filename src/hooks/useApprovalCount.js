'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const useApprovalCount = () => {
  const [approvalCount, setApprovalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovalCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchApprovalCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchApprovalCount = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setApprovalCount(0);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/instructor/approvals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setApprovalCount(response.data.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching approval count:', error);
      setApprovalCount(0);
    } finally {
      setLoading(false);
    }
  };

  return { approvalCount, loading, refetch: fetchApprovalCount };
};

export default useApprovalCount;