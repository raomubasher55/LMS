"use client";
import React, { useState, useEffect } from 'react';
import { 
  Mail, MessageSquare, User, Calendar, Search, Eye, Trash2, Filter,
  Users, TrendingUp, UserX, Download, X
} from 'lucide-react';

const NewsletterDashboard = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  
  // Contact states
  const [contactStats, setContactStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState('');
  const [contactCurrentPage, setContactCurrentPage] = useState(1);
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [contactDateFilter, setContactDateFilter] = useState('all');
  const [contactPagination, setContactPagination] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Newsletter states
  const [newsletterStats, setNewsletterStats] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [newsletterLoading, setNewsletterLoading] = useState(true);
  const [newsletterError, setNewsletterError] = useState('');
  const [subscriberCurrentPage, setSubscriberCurrentPage] = useState(1);
  const [subscriberSearchTerm, setSubscriberSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriberPagination, setSubscriberPagination] = useState(null);

  // Contact Functions
  const fetchContactStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const data = await response.json();
      if (data.success) {
        setContactStats(data.stats);
      }
    } catch (err) {
      setContactError('Failed to fetch contact statistics');
    }
  };

  const fetchContacts = async (page = 1, search = '', dateFilter = 'all') => {
    try {
      setContactLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(dateFilter !== 'all' && { dateFilter })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts);
        setContactPagination(data.pagination);
      } else {
        setContactError(data.message);
      }
    } catch (err) {
      setContactError('Failed to fetch contact messages');
    } finally {
      setContactLoading(false);
    }
  };

  const deleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setContacts(contacts.filter(contact => contact._id !== contactId));
        fetchContactStats();
      } else {
        setContactError(data.message);
      }
    } catch (err) {
      setContactError('Failed to delete contact message');
    }
  };

  // Newsletter Functions
  const fetchNewsletterStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletter/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const data = await response.json();
      if (data.success) {
        setNewsletterStats(data.stats);
      }
    } catch (err) {
      setNewsletterError('Failed to fetch newsletter statistics');
    }
  };

  const fetchSubscribers = async (page = 1, search = '', status = 'all') => {
    try {
      setNewsletterLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(status !== 'all' && { status })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletter/subscribers?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.subscribers);
        setSubscriberPagination(data.pagination);
      } else {
        setNewsletterError(data.message);
      }
    } catch (err) {
      setNewsletterError('Failed to fetch subscribers');
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Utility Functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateMessage = (message, length = 100) => {
    return message.length > length ? message.substring(0, length) + '...' : message;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      unsubscribed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unsubscribed' },
      bounced: { bg: 'bg-red-100', text: 'text-red-800', label: 'Bounced' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const openContactModal = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setSelectedContact(null);
    setShowContactModal(false);
  };

  // Effects
  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchContactStats();
      fetchContacts();
    } else {
      fetchNewsletterStats();
      fetchSubscribers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'contacts') {
      const delayedSearch = setTimeout(() => {
        fetchContacts(1, contactSearchTerm, contactDateFilter);
        setContactCurrentPage(1);
      }, 500);
      return () => clearTimeout(delayedSearch);
    }
  }, [contactSearchTerm, contactDateFilter]);

  useEffect(() => {
    if (activeTab === 'newsletter') {
      const delayedSearch = setTimeout(() => {
        fetchSubscribers(1, subscriberSearchTerm, statusFilter);
        setSubscriberCurrentPage(1);
      }, 500);
      return () => clearTimeout(delayedSearch);
    }
  }, [subscriberSearchTerm, statusFilter]);

  const handleContactPageChange = (page) => {
    setContactCurrentPage(page);
    fetchContacts(page, contactSearchTerm, contactDateFilter);
  };

  const handleSubscriberPageChange = (page) => {
    setSubscriberCurrentPage(page);
    fetchSubscribers(page, subscriberSearchTerm, statusFilter);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkblack p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Communications Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage contact messages and newsletter subscribers
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contacts'
                    ? 'border-blue text-blue dark:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <MessageSquare className="inline-block w-5 h-5 mr-2" />
                Contact Messages
              </button>
              <button
                onClick={() => setActiveTab('newsletter')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'newsletter'
                    ? 'border-blue text-blue dark:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Users className="inline-block w-5 h-5 mr-2" />
                Newsletter Subscribers
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'contacts' ? (
          <div>
            {/* Contact Statistics */}
            {contactStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-naveBlue border dark:border-gray-700 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-blue" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Messages</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{contactStats.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-naveBlue border dark:border-gray-700 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Today's Messages</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{contactStats.today.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-naveBlue border dark:border-gray-700 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Mail className="h-6 w-6 text-yellow1" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">This Week</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{contactStats.thisWeek.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Filters and Table */}
            <div className="bg-white dark:bg-naveBlue rounded-lg shadow mb-6">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={contactSearchTerm}
                        onChange={(e) => setContactSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="sm:w-48">
                    <select
                      value={contactDateFilter}
                      onChange={(e) => setContactDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent dark:text-gray-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-naveBlue">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-naveBlue divide-y divide-gray-200 dark:divide-gray-700">
                    {contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-50 dark:hover:bg-darkblack transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-full">
                              <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                            {truncateMessage(contact.message)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(contact.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openContactModal(contact)}
                              className="text-blue hover:text-blue dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4 dark:text-white" />
                              View
                            </button>
                            <button
                              onClick={() => deleteContact(contact._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {contacts.length === 0 && !contactLoading && (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No contact messages found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {contactSearchTerm || contactDateFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No contact messages have been received yet.'}
                    </p>
                  </div>
                )}

                {/* Contact Pagination */}
                {contactPagination && contactPagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Showing {((contactCurrentPage - 1) * 20) + 1} to {Math.min(contactCurrentPage * 20, contactPagination.totalContacts)} of {contactPagination.totalContacts} messages
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleContactPageChange(contactCurrentPage - 1)}
                          disabled={contactCurrentPage === 1}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                        >
                          Previous
                        </button>
                        
                        {[...Array(Math.min(5, contactPagination.totalPages))].map((_, i) => {
                          const pageNum = Math.max(1, contactCurrentPage - 2) + i;
                          if (pageNum <= contactPagination.totalPages) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handleContactPageChange(pageNum)}
                                className={`px-3 py-1 border text-sm rounded ${
                                  pageNum === contactCurrentPage
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })}
                        
                        <button
                          onClick={() => handleContactPageChange(contactCurrentPage + 1)}
                          disabled={contactCurrentPage === contactPagination.totalPages}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Newsletter Statistics */}
            {newsletterStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-naveBlue border dark:border-gray-700 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Subscribers</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{newsletterStats.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-naveBlue border dark:border-gray-700 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Active Subscribers</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{newsletterStats.active.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-naveBlue border dark:border-gray-700 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Recent (30 days)</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{newsletterStats.recentSubscriptions.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-naveBlue border dark:border-gray-700 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <UserX className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Unsubscribed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{newsletterStats.unsubscribed.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Newsletter Filters and Table */}
            <div className="bg-white dark:bg-naveBlue rounded-lg shadow mb-6">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search by email..."
                        value={subscriberSearchTerm}
                        onChange={(e) => setSubscriberSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="sm:w-48">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent dark:text-gray-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="unsubscribed">Unsubscribed</option>
                      <option value="bounced">Bounced</option>
                    </select>
                  </div>


                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-naveBlue">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Subscribed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Frequency
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-naveBlue divide-y divide-gray-200 dark:divide-gray-700">
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{subscriber.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(subscriber.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white capitalize">{subscriber.source}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(subscriber.subscribedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white capitalize">
                            {subscriber.preferences?.frequency || 'weekly'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {subscribers.length === 0 && !newsletterLoading && (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No subscribers found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {subscriberSearchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Start building your newsletter audience!'}
                    </p>
                  </div>
                )}
                {subscriberPagination && subscriberPagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Showing {((subscriberCurrentPage - 1) * 20) + 1} to {Math.min(subscriberCurrentPage * 20, subscriberPagination.totalSubscribers)} of {subscriberPagination.totalSubscribers} subscribers
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSubscriberPageChange(subscriberCurrentPage - 1)}
                          disabled={subscriberCurrentPage === 1}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                        >
                          Previous
                        </button>
                        
                        {[...Array(Math.min(5, subscriberPagination.totalPages))].map((_, i) => {
                          const pageNum = Math.max(1, subscriberCurrentPage - 2) + i;
                          if (pageNum <= subscriberPagination.totalPages) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handleSubscriberPageChange(pageNum)}
                                className={`px-3 py-1 border text-sm rounded ${
                                  pageNum === subscriberCurrentPage
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })}
                        
                        <button
                          onClick={() => handleSubscriberPageChange(subscriberCurrentPage + 1)}
                          disabled={subscriberCurrentPage === subscriberPagination.totalPages}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}


                </div>


        
        </div>
        </div>
        )}

        {/* Contact Modal */}
        {showContactModal && selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-naveBlue rounded-lg shadow-lg w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Message</h2>
                <button onClick={closeContactModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Name:</strong> {selectedContact.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Email:</strong> {selectedContact.email}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-900 dark:text-white">{selectedContact.message}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={closeContactModal} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NewsletterDashboard;