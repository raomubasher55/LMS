"use client";
import StudentQuizAttemptsContainer from "@/components/shared/containers/StudentQuizAttemptsContainer";
import TranslatedText from "@/components/shared/TranslatedText";
import useQuizAttempts from "@/hooks/useQuizAttempts";
import React, { useEffect, useState } from "react";

const StudentMyQuizPrimary = () => {
  const { quizAttempts, loading, error, fetchAllQuizAttempts } =
    useQuizAttempts();
  const [formattedResults, setFormattedResults] = useState([]);

  useEffect(() => {
    // Format quiz attempts data for QuizContainers component
    if (quizAttempts && quizAttempts.length > 0) {
      const formatted = quizAttempts.map((attempt, index) => ({
        id: attempt._id || index,
        date: new Date(attempt.attemptedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        title: `${attempt.courseName} - ${attempt.chapterTitle}`,
        studentName: "You", // Since this is the student's own attempts
        qus: attempt.answers ? attempt.answers.length : 0,
        tm: "15 mins", // Default time as it's not stored in attempts
        ca: Math.round(
          (attempt.score / 100) * (attempt.answers ? attempt.answers.length : 0)
        ),
        score: attempt.score,
        isView: true,
        status: attempt.passed ? "passed" : "failed",
        courseTitle: attempt.courseName,
        chapterTitle: attempt.chapterTitle,
        instructor: "Unknown Instructor", // Not included in current data structure
        totalAttempts: attempt.totalAttempts,
        bestScore: attempt.bestScore,
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
            <h3 className=" dark:text-white">
              <TranslatedText>Mes Tentatives de Quiz</TranslatedText>
            </h3>
          </div>
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden  dark:text-white">
                <TranslatedText>
                  Chargement des tentatives de quiz
                </TranslatedText>
                ...
              </span>
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
            <h3 className=" dark:text-white">
              <TranslatedText>Mes Tentatives de Quiz</TranslatedText>
            </h3>
          </div>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading  dark:text-white">
              <TranslatedText>
                Erreur lors du chargement des tentatives de quiz
              </TranslatedText>
            </h4>
            <p>
              {typeof error === "string"
                ? error
                : error?.message || "An error occurred"}
            </p>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={fetchAllQuizAttempts}
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
        <div className="student-dashboard__quiz-attempts">
          <div className="section__title text-center mb-4">
            <h3>
              <TranslatedText>Mes Tentatives de Quiz</TranslatedText>
            </h3>
          </div>
          <div className="text-center py-5">
            <div className="mb-3">
              <i
                className="icofont-ui-quiz"
                style={{ fontSize: "4rem", color: "#6c757d" }}
              ></i>
            </div>
            <h4 className="text-muted">
              <TranslatedText>
                Aucune tentative de quiz pour le moment
              </TranslatedText>
            </h4>
            <p className="text-muted">
              <TranslatedText>
                Vous n'avez encore tenté aucun quiz. Commencez à apprendre et
                passez votre premier quiz !
              </TranslatedText>
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
    <StudentQuizAttemptsContainer
      allResults={formattedResults}
      title={"My Quiz Attempts"}
    />
  );
};

export default StudentMyQuizPrimary;
