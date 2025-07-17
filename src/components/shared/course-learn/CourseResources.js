'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CourseResources = ({ course, progressData, courseId }) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [assignmentGraded, setAssignmentGraded] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    checkAssignmentStatus();
  }, [courseId]);

  useEffect(() => {
    // Check if course is complete (100% progress + graded assignment)
    const progress = progressData?.overallProgress || 0;
    const courseComplete = progress === 100 && assignmentGraded;
    setIsComplete(courseComplete);
  }, [progressData, assignmentGraded]);

  const checkAssignmentStatus = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token || !courseId) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/student/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        const submissions = response.data.data || [];
        // Check if any assignment is graded
        const hasGradedAssignment = submissions.some(sub => 
          sub.submission && sub.submission.grade && 
          sub.submission.grade.points !== undefined && 
          sub.submission.grade.points !== null
        );
        setAssignmentGraded(hasGradedAssignment);
      }
    } catch (error) {
      console.error('Error checking assignment status:', error);
    }
  };

  const downloadResource = async (resourceUrl, filename) => {
    console.log('Download URL:', resourceUrl);
    console.log('Filename:', filename);
    
    if (!resourceUrl) {
      alert('Download URL not available');
      return;
    }

    try {
      // First try fetch to check if file exists
      const response = await fetch(resourceUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error(`File not found: ${response.status}`);
      }

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = resourceUrl;
      link.download = filename || 'download';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(resourceUrl, '_blank');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF Document';
      case 'doc':
      case 'docx': return 'Word Document';
      case 'ppt':
      case 'pptx': return 'PowerPoint';
      case 'zip':
      case 'rar': return 'Archive';
      default: return 'File';
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'icofont-file-pdf';
      case 'doc':
      case 'docx': return 'icofont-file-word';
      case 'ppt':
      case 'pptx': return 'icofont-file-powerpoint';
      case 'zip':
      case 'rar': return 'icofont-file-zip';
      default: return 'icofont-file-text';
    }
  };

  // Debug logging
  console.log('Course data:', course);
  console.log('PDF Files:', course?.pdfFiles);
  console.log('Certificate File:', course?.certificateFile);

  return (
    <div className="course-resources">
      <h3 className="resource-title mb-4">Course Resources</h3>
      
      <div className="resource-tabs mb-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'materials' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('materials')}
          >
            Materials
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'certificates' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('certificates')}
          >
            Certificates
          </button>
        </div>
      </div>

      <div className="resource-content">
        {activeTab === 'materials' && (
          <div className="materials-section">
            {course?.pdfFiles?.length ? (
              <div className="materials-list space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  Found {course.pdfFiles.length} resource(s)
                </p>
                {course.pdfFiles.map((material, index) => (
                  <div key={index} className="material-item p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="file-icon">
                          <i className={`${getFileIcon(material.title)} text-2xl text-blue-500`}></i>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800">{material.title}</h5>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <span>{getFileType(material.title)}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="download-btn px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        style={{ 
                          backgroundColor: '#3b82f6', 
                          color: '#fbbf24',
                          border: 'none',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          const url = material.path || material.url;
                          const fullUrl = url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
                          downloadResource(fullUrl, material.originalname || material.title);
                        }}
                      >
                        <i className="icofont-download" style={{ color: '#fbbf24' }}></i>
                        <span style={{ color: '#fbbf24' }}>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-materials p-6 text-center text-gray-500">
                <i className="icofont-file-text text-4xl mb-2"></i>
                <p>No course materials available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="certificates-section">
            {course?.certificateFile ? (
              <div className="certificates-list space-y-3">
                {[{
                  title: "Course Completion Certificate",
                  description: "Certificate of completion for this course",
                  viewUrl: course.certificateFile 
                    ? (course.certificateFile.startsWith('http') ? course.certificateFile : `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.certificateFile}`)
                    : '#',
                  downloadUrl: course.certificateFile 
                    ? (course.certificateFile.startsWith('http') ? course.certificateFile : `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.certificateFile}`)
                    : '#',
                  filename: course.certificateFile?.split('/').pop() || "certificate.jpg"
                }].map((certificate, index) => (
                  <div key={index} className="certificate-item p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="certificate-icon">
                          <i className="icofont-certificate text-3xl text-yellow-600"></i>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800">{certificate.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{certificate.description}</p>
                          {isComplete && (
                            <p className="text-sm text-green-600 mt-1 font-medium">
                              ✅ Course completed! Certificate earned.
                            </p>
                          )}
                          {!isComplete && (
                            <div className="text-sm text-gray-500 mt-1">
                              <p>Progress: {progressData?.overallProgress || 0}% complete</p>
                              <p>Assignment: {assignmentGraded ? '✅ Graded' : '⏳ Pending grade'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="certificate-actions flex space-x-2">
                        {isComplete ? (
                          <>
                            <button 
                              className="view-btn px-3 py-2 rounded-lg transition-colors"
                              style={{ 
                                backgroundColor: '#3b82f6', 
                                color: '#fbbf24',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
                              onClick={() => window.open(certificate.viewUrl, '_blank')}
                            >
                              <i className="icofont-eye" style={{ color: '#fbbf24' }}></i>
                            </button>
                            <button 
                              className="download-btn px-3 py-2 rounded-lg transition-colors"
                              style={{ 
                                backgroundColor: '#10b981', 
                                color: '#fbbf24',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
                              onClick={() => downloadResource(certificate.downloadUrl, certificate.filename)}
                            >
                              <i className="icofont-download" style={{ color: '#fbbf24' }}></i>
                            </button>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500 px-3 py-2 bg-gray-100 rounded-lg">
                            <i className="icofont-lock mr-1"></i>
                            Complete course to unlock
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-certificates p-6 text-center text-gray-500">
                <i className="icofont-certificate text-4xl mb-2"></i>
                <p>Complete the course to earn your certificate</p>
                <p className="text-sm mt-1">Certificates will appear here after course completion</p>
                {!isComplete && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Requirements to unlock certificate:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li className={progressData?.overallProgress === 100 ? 'text-green-600' : ''}>
                        Complete all videos ({progressData?.overallProgress || 0}% done)
                      </li>
                      <li className={assignmentGraded ? 'text-green-600' : ''}>
                        Get assignment graded ({assignmentGraded ? 'Done' : 'Pending'})
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseResources;