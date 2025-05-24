"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useAssignmentSubmissions = (courseId = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [submissionSummary, setSubmissionSummary] = useState(null);

  // Fetch student's submissions for a course
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/student/course/${courseId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        setSubmissions(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch submissions');
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err?.message || String(err) || 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  // Submit an assignment
  const submitAssignment = async (assignmentId, formData) => {
    try {
      setLoading(true);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/${assignmentId}/submit`,
        formData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      if (response.data && response.data.success) {
        // Refresh the submissions list
        await fetchSubmissions();
        toast.success('Assignment submitted successfully');
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to submit assignment');
      }
    } catch (err) {
      console.error('Error submitting assignment:', err);
      setError(err?.message || String(err) || 'Failed to submit assignment');
      toast.error(err.response?.data?.message || err?.message || 'Failed to submit assignment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get a specific submission
  const getSubmission = async (submissionId) => {
    try {
      setLoading(true);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/${submissionId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch submission');
      }
    } catch (err) {
      console.error('Error fetching submission:', err);
      setError(err?.message || String(err) || 'Failed to fetch submission details');
      toast.error(err?.message || 'Failed to fetch submission details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get all assignments and submissions across all enrolled courses
  const fetchAllAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/student/assignments`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        setAllAssignments(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch assignments');
      }
    } catch (err) {
      console.error('Error fetching all assignments:', err);
      setError(err?.message || String(err) || 'Failed to fetch assignments');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get assignment submission summary statistics
  const fetchSubmissionSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/student/summary`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        setSubmissionSummary(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch submission summary');
      }
    } catch (err) {
      console.error('Error fetching submission summary:', err);
      return null;
    }
  };

  // Download submission files
  const downloadSubmission = (submissionId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }

    // Open submission download in new tab
    const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/${submissionId}`;
    window.open(downloadUrl, '_blank');
  };

  // Fetch submissions on component mount or courseId change
  useEffect(() => {
    if (courseId) {
      fetchSubmissions();
    } else {
      // If no courseId provided, fetch all assignments
      fetchAllAssignments();
      fetchSubmissionSummary();
    }
  }, [courseId]);

  return {
    submissions,
    allAssignments,
    submissionSummary,
    loading,
    error,
    submitAssignment,
    getSubmission,
    fetchAllAssignments,
    fetchSubmissionSummary,
    downloadSubmission,
    refetch: courseId ? fetchSubmissions : () => {
      fetchAllAssignments();
      fetchSubmissionSummary();
    }
  };
};

export default useAssignmentSubmissions;