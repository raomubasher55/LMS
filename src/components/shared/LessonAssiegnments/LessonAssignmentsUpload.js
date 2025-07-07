"use client";
import React, { useState } from 'react';
import axios from 'axios';

export default function LessonAssignmentsUpload({ CourseId }) {
    console.log(CourseId)
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    files: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setAssignment(prev => ({ ...prev, files: [...e.target.files] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('title', assignment.title);
      formData.append('description', assignment.description);
      formData.append('dueDate', assignment.dueDate);
      formData.append('maxPoints', assignment.maxPoints);
      assignment.files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${CourseId}/assignments`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage({ 
        text: 'Assignment created successfully!', 
        type: 'success' 
      });
      // Reset form after successful submission
      setAssignment({
        title: '',
        description: '',
        dueDate: '',
        maxPoints: 100,
        files: []
      });
    } catch (error) {
      console.error('Assignment creation error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to create assignment', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6  rounded-lg shadow-md">
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-bodyColor dark:text-blackColor-dark mb-1">
            Assignment Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={assignment.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-transparent border border-gray-300 text-bodyColor dark:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-bodyColor dark:text-blackColor-dark mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={assignment.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 bg-transparent border text-bodyColor dark:text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-bodyColor dark:text-blackColor-dark mb-1">
              Due Date *
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={assignment.dueDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-transparent border text-bodyColor dark:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="maxPoints" className="block text-sm font-medium text-bodyColor dark:text-gray-400 mb-1">
              Maximum Points *
            </label>
            <input
              type="number"
              id="maxPoints"
              name="maxPoints"
              min="1"
              value={assignment.maxPoints}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-transparent border text-bodyColor dark:text-blackColor-dark border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="files" className="block text-sm font-medium text-bodyColor dark:text-blackColor-dark mb-1">
            Supporting Files
          </label>
          <input
            type="file"
            id="files"
            name="files"
            onChange={handleFileChange}
            multiple
            className="w-full text-sm bg-transparent text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            PDF, DOC, PPT, or ZIP files (Max 10MB each)
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}