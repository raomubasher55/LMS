"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const useQuizAttempts = () => {
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [quizSummary, setQuizSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all quiz attempts across all enrolled courses
  const fetchAllQuizAttempts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quizes/attempts-all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setQuizAttempts(data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch quiz attempts');
      }
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      setError(error.message);
      toast.error(`Failed to load quiz attempts: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get quiz summary statistics
  const fetchQuizSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quizes/summary`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setQuizSummary(data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch quiz summary');
      }
    } catch (error) {
      console.error('Error fetching quiz summary:', error);
      setError(error.message);
      return null;
    }
  };

  // Submit quiz (existing functionality)
  const submitQuiz = async (courseId, chapterId, answers) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quizes/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          chapterId,
          answers
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        // Refresh quiz attempts after submission
        await fetchAllQuizAttempts();
        await fetchQuizSummary();
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error(`Failed to submit quiz: ${error.message}`);
      throw error;
    }
  };

  // Get quiz status for a specific chapter
  const getQuizStatus = async (courseId, chapterId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quizes/status/${courseId}/${chapterId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to get quiz status');
      }
    } catch (error) {
      console.error('Error getting quiz status:', error);
      return { completed: false, data: { attempts: 0, bestScore: 0, passed: false } };
    }
  };

  // Initialize data on hook mount
  useEffect(() => {
    fetchAllQuizAttempts();
    fetchQuizSummary();
  }, []);

  return {
    quizAttempts,
    quizSummary,
    loading,
    error,
    fetchAllQuizAttempts,
    fetchQuizSummary,
    submitQuiz,
    getQuizStatus,
    refetch: () => {
      fetchAllQuizAttempts();
      fetchQuizSummary();
    }
  };
};

export default useQuizAttempts;