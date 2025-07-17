"use client";
import StudentAssignmentsContainer from "@/components/shared/containers/StudentAssignmentsContainer";
import TranslatedText from "@/components/shared/TranslatedText";
import useAssignmentSubmissions from "@/hooks/useAssignmentSubmissions";
import React, { useEffect, useState } from "react";

const StudentAssingmentsPrimary = () => {
  const { 
    allAssignments, 
    loading, 
    error, 
    fetchAllAssignments
  } = useAssignmentSubmissions();
  const [formattedResults, setFormattedResults] = useState([]);

  useEffect(() => {
    // Format assignments data for the new StudentAssignmentResults component
    if (allAssignments && allAssignments.length > 0) {
      setFormattedResults(allAssignments);
    } else {
      setFormattedResults([]);
    }
  }, [allAssignments]);

  // Show loading state
  if (loading) {
    return (
      <div className="student-dashboard__content">
        <div className="student-dashboard__assignments">
          <div className="section__title text-center mb-4">
            <h3><TranslatedText>Devoirs</TranslatedText></h3>
          </div>
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden"><TranslatedText>Chargement des devoirs</TranslatedText>...</span>
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
          <div className="section__title text-center mb-4 dark:text-white">
            <h3><TranslatedText>Devoirs</TranslatedText></h3>
          </div>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading dark:text-white">Error <TranslatedText>Chargement des devoirs</TranslatedText></h4>
            <p>{typeof error === 'string' ? error : error?.message || 'An error occurred'}</p>
            <button 
              className="btn btn-outline-danger btn-sm dark:text-white"
              onClick={fetchAllAssignments}
            >
              <TranslatedText>Réessayer</TranslatedText>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!formattedResults || formattedResults.length === 0) {
    return (
      <div className="student-dashboard__content dark:text-white">
        <div className="student-dashboard__assignments">
          <div className="section__title text-center mb-4">
            <h3><TranslatedText>Devoirs</TranslatedText></h3>
          </div>
          <div className="text-center py-5">
            <div className="mb-3">
              <i className="icofont-file-document" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
            </div>
            <h4 className="text-muted"><TranslatedText>Aucun devoir pour le moment</TranslatedText></h4>
            <p className="text-muted">
              <TranslatedText>Vous n'avez aucun devoir pour le moment. Inscrivez-vous à des cours pour recevoir des devoirs !</TranslatedText>
            </p>
            <a href="/courses" className="btn btn-primary">
              <TranslatedText>Parcourir les Cours</TranslatedText>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StudentAssignmentsContainer 
      allResults={formattedResults} 
      title="My Assignments" 
    />
  );
};

export default StudentAssingmentsPrimary;
