'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useSweetAlert from '@/hooks/useSweetAlert';

const InstructorQuizApprovalsMain = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const createAlert = useSweetAlert();

  useEffect(() => {
    fetchApprovalRequests();
  }, []);

  const fetchApprovalRequests = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/instructor/approvals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setApprovalRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching approval requests:', error);
      createAlert('error', 'Failed to load approval requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, courseId, chapterId, action) => {
    const requestId = `${userId}-${courseId}-${chapterId}`;
    setProcessing(prev => ({ ...prev, [requestId]: true }));

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      if (action === 'approve') {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/grant-instructor-approval`,
          { userId, courseId, chapterId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        createAlert('success', 'Approval granted successfully');
        
        // Remove from the list
        setApprovalRequests(prev => 
          prev.filter(req => 
            !(req.userId === userId && req.courseId === courseId && req.chapterId === chapterId)
          )
        );
      } else {
        // For deny, we could implement a deny endpoint or just refresh
        createAlert('info', 'Approval denied - student will need to contact instructor directly');
        await fetchApprovalRequests();
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      createAlert('error', 'Failed to process approval');
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="instructor-quiz-approvals">
        <div className="quiz-approvals__header mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quiz Approval Requests</h2>
          <p className="text-gray-600">Manage student requests for quiz retake approvals</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
          <p className="text-gray-600">Loading approval requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-quiz-approvals">
      <div className="quiz-approvals__header mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quiz Approval Requests</h2>
        <p className="text-gray-600">Manage student requests for quiz retake approvals</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
            <span className="text-yellow-800 font-medium">{approvalRequests.length} Pending Requests</span>
          </div>
          <button 
            onClick={fetchApprovalRequests}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {approvalRequests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-green-500 mb-4">
            <i className="icofont-check-circled text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Pending Requests</h3>
          <p className="text-gray-600">All students are up to date with their quiz attempts.</p>
        </div>
      ) : (
        <div className="quiz-approvals__list space-y-4">
          {approvalRequests.map((request) => {
            const requestId = `${request.userId}-${request.courseId}-${request.chapterId}`;
            const isProcessing = processing[requestId];

            return (
              <div 
                key={requestId}
                className="approval-request bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <i className="icofont-warning text-red-600"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{request.userName}</h3>
                        <p className="text-sm text-gray-600">{request.userEmail}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Course</label>
                        <p className="text-gray-800">{request.courseName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Chapter ID</label>
                        <p className="text-gray-800">{request.chapterId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Attempts</label>
                        <p className="text-red-600 font-medium">{request.totalAttempts} attempts</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Best Score</label>
                        <p className="text-gray-800">{request.bestScore}%</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Attempt</label>
                        <p className="text-gray-800">{formatDate(request.lastAttemptAt)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Requested</label>
                        <p className="text-gray-800">{formatDate(request.requestedAt)}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 text-sm">
                        <i className="icofont-info-circle mr-2"></i>
                        This student has failed the quiz <strong>{request.totalAttempts} times</strong> and requires instructor approval to continue.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => handleApproval(request.userId, request.courseId, request.chapterId, 'approve')}
                      disabled={isProcessing}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isProcessing 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isProcessing ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleApproval(request.userId, request.courseId, request.chapterId, 'deny')}
                      disabled={isProcessing}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isProcessing 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InstructorQuizApprovalsMain;