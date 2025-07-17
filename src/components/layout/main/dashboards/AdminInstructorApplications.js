"use client";
import React, { useState, useEffect } from 'react';
import { Search, Mail, Trash2, Eye, Users, Calendar, Filter, X, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import TranslatedText from '@/components/shared/TranslatedText';

export default function AdminInstructorApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [emailSending, setEmailSending] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch applications
  const fetchApplications = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/applications?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.data.applications);
        setTotalPages(data.data.pagination.totalPages);
        setTotalApplications(data.data.pagination.totalApplications);
      } else {
        showNotification('Failed to fetch applications', 'error');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      showNotification('Error fetching applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single application details
  const fetchApplicationDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/applications/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedApplication(data.data.application);
        setShowDetailsModal(true);
      } else {
        showNotification('Failed to fetch application details', 'error');
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      showNotification('Error fetching application details', 'error');
    }
  };

  // Contact instructor
  const contactInstructor = async (applicationId) => {
    try {
      setEmailSending(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/applications/${applicationId}/contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        showNotification('Email sent successfully!', 'success');
        setShowContactModal(false);
        setContactForm({ subject: '', message: '' });
      } else {
        const error = await response.json();
        showNotification(error.message || 'Failed to send email', 'error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showNotification('Error sending email', 'error');
    } finally {
      setEmailSending(false);
    }
  };

  // Delete application
  const deleteApplication = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showNotification('Application deleted successfully', 'success');
        fetchApplications(currentPage, searchTerm);
        if (selectedApplication && selectedApplication._id === id) {
          setSelectedApplication(null);
          setShowDetailsModal(false);
        }
      } else {
        showNotification('Failed to delete application', 'error');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      showNotification('Error deleting application', 'error');
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplications(1, searchTerm);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchApplications(page, searchTerm);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"><TranslatedText>Demandes d'instructeurs</TranslatedText></h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 md:mt-2"><TranslatedText>Gérer et examiner les candidatures des instructeurs</TranslatedText></p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 px-3 py-1 md:px-4 md:py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-blue" />
                <span className="text-blue font-semibold text-sm md:text-base">{totalApplications} Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <AlertCircle className="h-4 w-4 md:h-5 md:w-5" />
          )}
          <span className="text-sm md:text-base">{notification.message}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white h-3 w-3 md:h-4 md:w-4" />
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-9 pr-3 md:pl-10 md:pr-4 py-2 border border-gray-300 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-transparent outline-none text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 dark:text-white text-blue rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            <Search className="h-3 w-3 md:h-4 md:w-4" />
            <span><TranslatedText>Rechercher</TranslatedText></span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <div className="rounded-lg shadow-sm border border-gray-200">
            <div className="p-3 md:p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white"><TranslatedText>Candidatures</TranslatedText></h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-6 md:p-8 text-center">
                  <Loader className="h-6 w-6 md:h-8 md:w-8 animate-spin mx-auto text-blue-600" />
                  <p className="text-gray-500 mt-2 text-sm md:text-base">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="p-6 md:p-8 text-center">
                  <Users className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-300" />
                  <p className="text-gray-500 mt-3 md:mt-4 text-sm md:text-base"><TranslatedText>Aucune candidature trouvée</TranslatedText></p>
                </div>
              ) : (
                applications.map((application) => (
                  <div key={application._id} className="p-3 md:p-4 bg-opacity-50">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm md:text-base">
                              {application.firstName[0]}{application.lastName[0]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-sm md:text-base truncate">
                              {application.firstName} {application.lastName}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{application.email}</p>
                            <p className="text-xs md:text-sm text-gray-500 truncate">{application.phone}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium"><TranslatedText>Expertise</TranslatedText>:</p>
                          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-400 truncate">{application.expertise}</p>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          Applied: {new Date(application.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <button
                          onClick={() => fetchApplicationDetails(application._id)}
                          className="p-1 md:p-2 text-blue hover:bg-blue-light rounded-lg"
                          title="View Details"
                        >
                          <Eye className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowContactModal(true);
                          }}
                          className="p-1 md:p-2 text-green-600 hover:bg-green-100 rounded-lg"
                          title="Contact Instructor"
                        >
                          <Mail className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                        <button
                          onClick={() => deleteApplication(application._id)}
                          className="p-1 md:p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          title="Delete Application"
                        >
                          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-3 md:p-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <p className="text-xs md:text-sm text-gray-600">
                    <TranslatedText>Affichage</TranslatedText> {applications.length} of {totalApplications} <TranslatedText>candidatures</TranslatedText>
                  </p>
                  <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-end">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <TranslatedText>Précédent</TranslatedText>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm border rounded ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <TranslatedText>Suivant</TranslatedText>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Application Details Panel - Hidden on mobile when no selection */}
        <div className={`lg:col-span-1 ${!selectedApplication ? 'hidden lg:block' : ''}`}>
          <div className=" rounded-lg shadow-sm border border-gray-200 sticky top-4">
            <div className="p-3 md:p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white"><TranslatedText>Détails de la candidature</TranslatedText></h2>
                <button 
                  onClick={() => setSelectedApplication(null)} 
                  className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {selectedApplication ? (
              <div className="p-3 md:p-4 space-y-3 md:space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-300 text-base md:text-lg">
                    {selectedApplication.firstName} {selectedApplication.lastName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{selectedApplication.email}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{selectedApplication.phone}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-2 text-sm md:text-base">Bio</h4>
                  <p className="text-xs md:text-sm bg-transparent border text-gray-700 dark:text-gray-300 bg-gray-50 p-2 md:p-3 rounded-lg">
                    {selectedApplication.bio}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-2 text-sm md:text-base">Expertise</h4>
                  <p className="text-xs md:text-sm bg-transparent border text-gray-700 dark:text-gray-300 bg-gray-50 p-2 md:p-3 rounded-lg">
                    {selectedApplication.expertise}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-2 text-sm md:text-base">Experience</h4>
                  <p className="text-xs md:text-sm bg-transparent border text-gray-700 dark:text-gray-300 bg-gray-50 p-2 md:p-3 rounded-lg">
                    {selectedApplication.experience}
                  </p>
                </div>

                {selectedApplication.courseTopics && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-2 text-sm md:text-base">Course Topics</h4>
                    <p className="text-xs md:text-sm bg-transparent border text-gray-700 dark:text-gray-300 bg-gray-50 p-2 md:p-3 rounded-lg">
                      {selectedApplication.courseTopics}
                    </p>
                  </div>
                )}

                {selectedApplication.teachingExperience && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-2 text-sm md:text-base">Teaching Experience</h4>
                    <p className="text-xs md:text-sm bg-transparent border text-gray-700 dark:text-gray-300 bg-gray-50 p-2 md:p-3 rounded-lg">
                      {selectedApplication.teachingExperience}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1 md:mb-2 text-sm md:text-base">Application Date</h4>
                  <p className="text-xs md:text-sm bg-transparent  text-gray-700 dark:text-gray-300">
                    {new Date(selectedApplication.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="pt-3 md:pt-4 space-y-2">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 text-sm md:text-base"
                  >
                    <Mail className="h-3 w-3 md:h-4 md:w-4" />
                    <span><TranslatedText>Contacter l'instructeur</TranslatedText></span>
                  </button>
                  <button
                    onClick={() => deleteApplication(selectedApplication._id)}
                    className="w-full px-3 py-2 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2 text-sm md:text-base"
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                    <span><TranslatedText>Supprimer la candidature</TranslatedText></span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 md:p-8 text-center">
                <Eye className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-300" />
                <p className="text-gray-500 mt-3 md:mt-4 text-sm md:text-base"><TranslatedText>Sélectionnez une candidature pour voir les détails</TranslatedText></p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-lg font-semibold text-gray-900"><TranslatedText>Contacter l'instructeur</TranslatedText></h3>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setContactForm({ subject: '', message: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedApplication && (
              <div className="mb-3 md:mb-4 p-2 md:p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 text-sm md:text-base">
                  {selectedApplication.firstName} {selectedApplication.lastName}
                </p>
                <p className="text-xs md:text-sm text-gray-600">{selectedApplication.email}</p>
              </div>
            )}

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Email subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatedText>Message</TranslatedText>
                </label>
                <textarea
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Your message..."
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                <button
                  onClick={() => contactInstructor(selectedApplication._id)}
                  disabled={!contactForm.subject || !contactForm.message || emailSending}
                  className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-blue text-white rounded-lg hover:bg-blue disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  {emailSending ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{emailSending ? 'Sending...' : 'Send Email'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setContactForm({ subject: '', message: '' });
                  }}
                  className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm md:text-base"
                >
                  <TranslatedText>Annuler</TranslatedText>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Modal (for mobile) */}
      {/* {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 lg:hidden">
          <div className="bg-white rounded-lg w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Application Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)} 
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {selectedApplication && (
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {selectedApplication.firstName} {selectedApplication.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedApplication.email}</p>
                  <p className="text-gray-600">{selectedApplication.phone}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.bio}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Expertise</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.expertise}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.experience}
                  </p>
                </div>

                {selectedApplication.courseTopics && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Course Topics</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedApplication.courseTopics}
                    </p>
                  </div>
                )}

                {selectedApplication.teachingExperience && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Teaching Experience</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedApplication.teachingExperience}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Application Date</h4>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedApplication.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowContactModal(true);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact Instructor</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      deleteApplication(selectedApplication._id);
                    }}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Application</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}