'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useSweetAlert from '@/hooks/useSweetAlert';

const CourseAssignments = ({ courseId, onAssignmentSubmitted }) => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState({});
  const createAlert = useSweetAlert();

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        console.log('No token found, user not logged in');
        return;
      }

      console.log('Fetching assignments with token:', token.substring(0, 20) + '...');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${courseId}/assignments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Assignment response:', response.data);
      if (response.data.success) {
        setAssignments(response.data.data || response.data.assignments || []);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      if (error.response?.status === 401) {
        console.log('Authentication failed - user may need to login again');
      }
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        console.log('No token found for submissions');
        setLoading(false);
        return;
      }

      console.log('Fetching submissions with token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/student/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Submissions response:', response.data);
      if (response.data.success) {
        setSubmissions(response.data.data || response.data.submissions || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      if (error.response?.status === 401) {
        console.log('Authentication failed for submissions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (assignmentId, files) => {
    setSelectedFiles(prev => ({
      ...prev,
      [assignmentId]: files
    }));
  };

  const submitAssignment = async (assignmentId) => {
    try {
      const files = selectedFiles[assignmentId];
      if (!files || files.length === 0) {
        createAlert('error', 'Please select files to submit');
        return;
      }

      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        createAlert('error', 'Please login to submit assignment');
        return;
      }

      console.log('Submitting assignment:', assignmentId);
      console.log('Files count:', files.length);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/${assignmentId}/submit`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      console.log('Assignment submission response:', response.data);

      if (response.data.success) {
        createAlert('success', 'Assignment submitted successfully!');
        fetchSubmissions();
        setSelectedFiles(prev => ({
          ...prev,
          [assignmentId]: null
        }));
        onAssignmentSubmitted && onAssignmentSubmitted(assignmentId);
      } else {
        createAlert('error', response.data.message || 'Failed to submit assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      
      let errorMessage = 'Failed to submit assignment';
      if (error.response) {
        console.error('Response error:', error.response.data);
        errorMessage = error.response.data.message || `Server Error: ${error.response.status}`;
      } else if (error.request) {
        console.error('Request error:', error.request);
        errorMessage = 'Network error - please check your connection';
      } else {
        console.error('General error:', error.message);
        errorMessage = error.message;
      }
      
      createAlert('error', errorMessage);
    }
  };

  const getSubmissionStatus = (assignmentId) => {
    const submissionData = submissions.find(sub => {
      const subAssignmentId = sub.assignment?._id || sub.assignment;
      return subAssignmentId === assignmentId;
    });
    
    // Return the actual submission object, not the wrapper
    return submissionData?.submission;
  };

  const canSubmitAssignment = (assignmentId, submission) => {
    // Can submit if no submission exists or if status is 'resubmit'
    return !submission || submission.status === 'resubmit';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="assignments-loading p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading assignments...</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      return (
        <div className="no-auth bg-yellow-50 p-6 rounded-lg text-center border border-yellow-200">
          <div className="text-yellow-500 mb-2">🔒</div>
          <p className="text-yellow-800 font-medium">Please log in to view assignments</p>
          <p className="text-yellow-600 text-sm mt-1">You need to be authenticated to access course assignments.</p>
        </div>
      );
    }
    
    return (
      <div className="no-assignments bg-gray-50 p-6 rounded-lg text-center">
        <div className="text-gray-400 mb-2">📝</div>
        <p className="text-gray-600">No assignments available for this course.</p>
      </div>
    );
  }

  return (
    <div className="assignments-container space-y-6">
      <h3 className="text-xl font-semibold mb-4">Course Assignments</h3>
      
      {assignments.map((assignment) => {
        const submission = getSubmissionStatus(assignment._id);
        const canSubmit = canSubmitAssignment(assignment._id, submission);
        
        return (
          <div key={assignment._id} className="assignment-card bg-white border rounded-lg p-6">
            <div className="assignment-header mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold mb-2">{assignment.title}</h4>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    submission && submission.submittedAt
                      ? submission.status === 'graded' 
                        ? 'bg-green-100 text-green-800'
                        : submission.status === 'resubmit'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission && submission.submittedAt
                      ? submission.status === 'graded' 
                        ? `Graded: ${submission.grade?.points || submission.grade}/${assignment.maxPoints}`
                        : submission.status === 'resubmit'
                          ? 'Resubmission Required'
                          : 'Submitted'
                      : 'Pending'
                    }
                  </div>
                </div>
              </div>
              
              <div className="assignment-details text-sm text-gray-600">
                <div>
                  <span className="font-medium">Max Points:</span>
                  <span className="ml-2">{assignment.maxPoints}</span>
                </div>
              </div>
            </div>

            {assignment.files && assignment.files.length > 0 && (
              <div className="assignment-files mb-4">
                <h5 className="font-medium mb-2">Assignment Files:</h5>
                <div className="files-list space-y-2">
                  {assignment.files.map((file, index) => (
                    <a
                      key={index}
                      href={file.path 
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${file.path}`
                        : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <span className="mr-2">📄</span>
                      {file.originalname}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {canSubmit && (
              <div className="submission-section border-t pt-4">
                <h5 className="font-medium mb-3">
                  {submission?.status === 'resubmit' ? 'Resubmit Assignment' : 'Submit Assignment'}
                </h5>
                {submission?.status === 'resubmit' && submission.grade?.feedback && (
                  <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-sm font-medium text-orange-800 mb-1">Feedback for Resubmission:</p>
                    <p className="text-sm text-orange-700">{submission.grade.feedback}</p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(assignment._id, e.target.files)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    accept=".pdf,.doc,.docx,.txt,.zip"
                  />
                  <button
                    onClick={() => submitAssignment(assignment._id)}
                    disabled={!selectedFiles[assignment._id]}
                    className={`px-4 py-2 rounded font-medium text-sm ${
                      selectedFiles[assignment._id]
                        ? 'bg-primaryColor text-white hover:bg-primaryColor/90'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {submission?.status === 'resubmit' ? 'Resubmit' : 'Submit'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Accepted formats: PDF, DOC, DOCX, TXT, ZIP
                </p>
              </div>
            )}

            {submission && submission.submittedAt && (
              <div className="submission-info border-t pt-4">
                <h5 className="font-medium mb-2">Your Submission</h5>
                <div className="text-sm text-gray-600">
                  <p>Submitted on: {formatDate(submission.submittedAt)}</p>
                  {submission.status === 'graded' && submission.grade && (
                    <>
                      <p>Grade: {submission.grade.points || submission.grade}/{assignment.maxPoints}</p>
                      {submission.grade.feedback && (
                        <div className="mt-2">
                          <p className="font-medium">Feedback:</p>
                          <p className="bg-gray-50 p-2 rounded">{submission.grade.feedback}</p>
                        </div>
                      )}
                    </>
                  )}
                  {submission.status === 'resubmit' && (
                    <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                      <p className="text-orange-800 font-medium">Resubmission Required</p>
                      <p className="text-orange-700 text-xs">Please review the feedback and submit a new version.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseAssignments;