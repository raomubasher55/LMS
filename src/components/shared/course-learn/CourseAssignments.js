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

      if (response.data.success) {
        createAlert('success', 'Assignment submitted successfully!');
        fetchSubmissions();
        setSelectedFiles(prev => ({
          ...prev,
          [assignmentId]: null
        }));
        onAssignmentSubmitted && onAssignmentSubmitted(assignmentId);
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      createAlert('error', 'Failed to submit assignment');
    }
  };

  const getSubmissionStatus = (assignmentId) => {
    return submissions.find(sub => sub.assignment === assignmentId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
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
        const overdue = isOverdue(assignment.dueDate);
        
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
                    submission 
                      ? submission.status === 'graded' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                      : overdue 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission 
                      ? submission.status === 'graded' 
                        ? `Graded: ${submission.grade}/${assignment.maxPoints}`
                        : 'Submitted'
                      : overdue 
                        ? 'Overdue'
                        : 'Pending'
                    }
                  </div>
                </div>
              </div>
              
              <div className="assignment-details grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Due Date:</span>
                  <span className={`ml-2 ${overdue ? 'text-red-600' : ''}`}>
                    {formatDate(assignment.dueDate)}
                  </span>
                </div>
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
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${file.path}`}
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

            {!submission && !overdue && (
              <div className="submission-section border-t pt-4">
                <h5 className="font-medium mb-3">Submit Assignment</h5>
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
                    Submit
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Accepted formats: PDF, DOC, DOCX, TXT, ZIP
                </p>
              </div>
            )}

            {submission && (
              <div className="submission-info border-t pt-4">
                <h5 className="font-medium mb-2">Your Submission</h5>
                <div className="text-sm text-gray-600">
                  <p>Submitted on: {formatDate(submission.submittedAt)}</p>
                  {submission.status === 'graded' && (
                    <>
                      <p>Grade: {submission.grade}/{assignment.maxPoints}</p>
                      {submission.feedback && (
                        <div className="mt-2">
                          <p className="font-medium">Feedback:</p>
                          <p className="bg-gray-50 p-2 rounded">{submission.feedback}</p>
                        </div>
                      )}
                    </>
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