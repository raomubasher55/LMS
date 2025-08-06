"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useEnrolledCourses = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState({ all: [], active: [], completed: [] });

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/enrollment/enrolled-courses`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        setEnrolledCourses(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch enrolled courses');
      }
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError(err?.message || String(err) || 'Failed to fetch enrolled courses');
      toast.error(err?.message || 'Failed to fetch enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  const updateCourseProgress = async (courseId, progress) => {
    try {
      setLoading(true);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/enrollment/progress`,
        { courseId, progress },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        // Refresh the course list
        await fetchEnrolledCourses();
        toast.success('Course progress updated');
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to update course progress');
      }
    } catch (err) {
      console.error('Error updating course progress:', err);
      setError(err?.message || String(err) || 'Failed to update course progress');
      toast.error(err?.message || 'Failed to update course progress');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markCourseAsCompleted = async (courseId) => {
    try {
      setLoading(true);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/enrollment/complete/${courseId}`,
        {},
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        // Refresh the course list
        await fetchEnrolledCourses();
        toast.success('Course marked as completed');
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to mark course as completed');
      }
    } catch (err) {
      console.error('Error marking course as completed:', err);
      setError(err?.message || String(err) || 'Failed to mark course as completed');
      toast.error(err?.message || 'Failed to mark course as completed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled courses on component mount
  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  return {
    enrolledCourses,
    loading,
    error,
    updateCourseProgress,
    markCourseAsCompleted,
    refetch: fetchEnrolledCourses
  };
};

export default useEnrolledCourses;