'use client';
import { useState } from 'react';

const CourseResources = ({ course }) => {
  const [activeTab, setActiveTab] = useState('materials');

  const downloadResource = (resourceUrl, filename) => {
    const link = document.createElement('a');
    link.href = resourceUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                        className="download-btn px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        onClick={() => downloadResource(`${process.env.NEXT_PUBLIC_BACKEND_URL}${material.url}`, material.title)}
                      >
                        <i className="icofont-download"></i>
                        <span>Download</span>
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
                  viewUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.certificateFile}`,
                  downloadUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.certificateFile}`,
                  filename: "certificate.jpg"
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
                          {certificate.completionDate && (
                            <p className="text-sm text-gray-500 mt-1">
                              Earned on: {new Date(certificate.completionDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="certificate-actions flex space-x-2">
                        <button 
                          className="view-btn px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          onClick={() => window.open(certificate.viewUrl, '_blank')}
                        >
                          <i className="icofont-eye"></i>
                        </button>
                        <button 
                          className="download-btn px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          onClick={() => downloadResource(certificate.downloadUrl, certificate.filename)}
                        >
                          <i className="icofont-download"></i>
                        </button>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseResources;