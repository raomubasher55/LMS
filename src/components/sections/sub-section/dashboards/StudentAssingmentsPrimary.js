"use client";
import QuizContainers from "@/components/shared/containers/QuizContainers";
import useAssignmentSubmissions from "@/hooks/useAssignmentSubmissions";
import React, { useEffect, useState } from "react";

const StudentAssingmentsPrimary = () => {
  const { 
    allAssignments, 
    loading, 
    error, 
    fetchAllAssignments, 
    downloadSubmission 
  } = useAssignmentSubmissions();
  const [formattedResults, setFormattedResults] = useState([]);

  useEffect(() => {
    // Format assignments data for QuizContainers component
    if (allAssignments && allAssignments.length > 0) {
      const formatted = allAssignments.map((assignment, index) => ({
        id: assignment._id || index,
        title: assignment.assignment.title,
        courseName: assignment.course.title,
        tm: assignment.assignment.totalMarks || assignment.assignment.maxPoints,
        isSubmit: !!assignment.submission,
        isDownload: assignment.submission?.hasFiles || false,
        totalSubmit: assignment.submissionCount || 1,
        status: assignment.status,
        submittedAt: assignment.submission?.submittedAt,
        grade: assignment.submission?.grade,
        dueDate: assignment.assignment.dueDate,
        downloadUrl: assignment.downloadUrl,
        submissionId: assignment.submission?._id,
        description: assignment.assignment.description
      }));
      setFormattedResults(formatted);
    } else {
      setFormattedResults([]);
    }
  }, [allAssignments]);

  // Handle download action
  const handleDownload = (assignment) => {
    if (assignment.submissionId) {
      downloadSubmission(assignment.submissionId);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="student-dashboard__content">
        <div className="student-dashboard__assignments">
          <div className="section__title text-center mb-4">
            <h3>Assignments</h3>
          </div>
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading assignments...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="student-dashboard__content">
        <div className="student-dashboard__assignments">
          <div className="section__title text-center mb-4">
            <h3>Assignments</h3>
          </div>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Assignments</h4>
            <p>{typeof error === 'string' ? error : error?.message || 'An error occurred'}</p>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={fetchAllAssignments}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!formattedResults || formattedResults.length === 0) {
    return (
      <div className="student-dashboard__content">
        <div className="student-dashboard__assignments">
          <div className="section__title text-center mb-4">
            <h3>Assignments</h3>
          </div>
          <div className="text-center py-5">
            <div className="mb-3">
              <i className="icofont-file-document" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
            </div>
            <h4 className="text-muted">No Assignments Yet</h4>
            <p className="text-muted">
              You don't have any assignments yet. Enroll in courses to get assignments!
            </p>
            <a href="/courses" className="btn btn-primary">
              Browse Courses
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QuizContainers 
      allResults={formattedResults} 
      title="Assignments" 
      table={2}
    />
  );
};

export default StudentAssingmentsPrimary;
