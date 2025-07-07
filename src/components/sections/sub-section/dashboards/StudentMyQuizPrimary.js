"use client";
import StudentQuizAttemptsContainer from "@/components/shared/containers/StudentQuizAttemptsContainer";
import useQuizAttempts from "@/hooks/useQuizAttempts";
import React, { useEffect, useState } from "react";

const StudentMyQuizPrimary = () => {
  const { quizAttempts, loading, error, fetchAllQuizAttempts } = useQuizAttempts();
  const [formattedResults, setFormattedResults] = useState([]);

  useEffect(() => {
    // Format quiz attempts data for QuizContainers component
    if (quizAttempts && quizAttempts.length > 0) {
      const formatted = quizAttempts.map((attempt, index) => ({
        id: attempt._id || index,
        date: new Date(attempt.attemptedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        title: `${attempt.courseName} - ${attempt.chapterTitle}`,
        studentName: "You", // Since this is the student's own attempts
        qus: attempt.answers ? attempt.answers.length : 0,
        tm: "15 mins", // Default time as it's not stored in attempts
        ca: Math.round((attempt.score / 100) * (attempt.answers ? attempt.answers.length : 0)),
        score: attempt.score,
        isView: true,
        status: attempt.passed ? 'passed' : 'failed',
        courseTitle: attempt.courseName,
        chapterTitle: attempt.chapterTitle,
        instructor: "Unknown Instructor", // Not included in current data structure
        totalAttempts: attempt.totalAttempts,
        bestScore: attempt.bestScore
      }));
      setFormattedResults(formatted);
    } else {
      setFormattedResults([]);
    }
  }, [quizAttempts]);

  // Show loading state
  if (loading) {
    return (
      <div className="student-dashboard__content">
        <div className="student-dashboard__quiz-attempts">
          <div className="section__title text-center mb-4">
            <h3>My Quiz Attempts</h3>
          </div>
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading quiz attempts...</span>
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
        <div className="student-dashboard__quiz-attempts">
          <div className="section__title text-center mb-4">
            <h3>My Quiz Attempts</h3>
          </div>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Quiz Attempts</h4>
            <p>{typeof error === 'string' ? error : error?.message || 'An error occurred'}</p>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={fetchAllQuizAttempts}
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
        <div className="student-dashboard__quiz-attempts">
          <div className="section__title text-center mb-4">
            <h3>My Quiz Attempts</h3>
          </div>
          <div className="text-center py-5">
            <div className="mb-3">
              <i className="icofont-ui-quiz" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
            </div>
            <h4 className="text-muted">No Quiz Attempts Yet</h4>
            <p className="text-muted">
              You haven't attempted any quizzes yet. Start learning and take your first quiz!
            </p>
            <a href="/courses" className="btn btn-primary">
              Browse Courses
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <StudentQuizAttemptsContainer allResults={formattedResults} title={"My Quiz Attempts"} />;
};

export default StudentMyQuizPrimary;
