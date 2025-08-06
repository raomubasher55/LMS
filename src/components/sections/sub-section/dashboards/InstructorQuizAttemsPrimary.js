"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import useSweetAlert from "@/hooks/useSweetAlert";
import TranslatedText from "@/components/shared/TranslatedText";

const InstructorQuizAttemsPrimary = ({ title, path }) => {
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [filteredAttempts, setFilteredAttempts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    courseId: "",
    status: "all",
    searchTerm: "",
  });
  const createAlert = useSweetAlert();

  useEffect(() => {
    fetchCourses();
    fetchQuizAttempts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quizAttempts, filters]);

  const fetchCourses = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course/instructor-courses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCourses(response.data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchQuizAttempts = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/instructor/student-progress`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Transform student progress data into quiz attempts format
        const attempts = [];
        response.data.data.forEach((student) => {
          student.courses.forEach((course) => {
            course.quizProgress.forEach((quiz) => {
              // Check if we have actual attempts or just totalAttempts
              if (quiz.attempts && quiz.attempts.length > 0) {
                // Process actual attempts
                quiz.attempts.forEach((attempt, index) => {
                  attempts.push({
                    id: `${student.studentId}-${course.courseId}-${quiz.chapterId}-${index}`,
                    studentId: student.studentId,
                    studentName: student.studentName,
                    studentEmail: student.studentEmail,
                    courseId: course.courseId,
                    courseName: course.courseName,
                    chapterId: quiz.chapterId,
                    score: attempt.score || 0,
                    passed: attempt.passed || false,
                    attemptedAt: attempt.attemptedAt,
                    answers: attempt.answers || [],
                    totalAttempts: quiz.attempts.length, // Use actual attempts count
                    bestScore: quiz.bestScore || 0,
                    restrictionStatus: quiz.restrictionStatus,
                  });
                });
              } else if (quiz.totalAttempts > 0) {
                // Handle case where totalAttempts exists but attempts array is empty
                // This indicates the database issue where attempts weren't properly stored
                attempts.push({
                  id: `${student.studentId}-${course.courseId}-${quiz.chapterId}-summary`,
                  studentId: student.studentId,
                  studentName: student.studentName,
                  studentEmail: student.studentEmail,
                  courseId: course.courseId,
                  courseName: course.courseName,
                  chapterId: quiz.chapterId,
                  score: quiz.bestScore || 0,
                  passed: quiz.passed || false,
                  attemptedAt: quiz.lastAttemptAt || new Date(),
                  answers: [],
                  totalAttempts: quiz.totalAttempts || 0,
                  bestScore: quiz.bestScore || 0,
                  restrictionStatus: quiz.restrictionStatus,
                  isSummary: true, // Flag to indicate this is a summary record
                });
              }
            });
          });
        });

        // Sort by most recent first
        attempts.sort(
          (a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt)
        );
        setQuizAttempts(attempts);
      }
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
      createAlert("error", "Failed to load quiz attempts");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...quizAttempts];

    // Filter by course
    if (filters.courseId) {
      filtered = filtered.filter(
        (attempt) => attempt.courseId === filters.courseId
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      switch (filters.status) {
        case "passed":
          filtered = filtered.filter((attempt) => attempt.passed);
          break;
        case "failed":
          filtered = filtered.filter((attempt) => !attempt.passed);
          break;
        case "restricted":
          filtered = filtered.filter(
            (attempt) => attempt.restrictionStatus?.timeRestricted
          );
          break;
      }
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (attempt) =>
          attempt.studentName.toLowerCase().includes(searchLower) ||
          attempt.studentEmail.toLowerCase().includes(searchLower) ||
          attempt.courseName.toLowerCase().includes(searchLower) ||
          attempt.chapterId.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAttempts(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (attempt) => {
    if (attempt.restrictionStatus?.timeRestricted) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
          <TranslatedText>Temps limité</TranslatedText>
        </span>
      );
    }
    if (attempt.passed) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          <TranslatedText>Réussi</TranslatedText>
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        <TranslatedText>Échoué</TranslatedText>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="instructor-quiz-attempts">
        <div className="attempts__header mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600">
            <TranslatedText>
              Surveillez toutes les tentatives de quiz dans vos cours
            </TranslatedText>
          </p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
          <p className="text-gray-600">
            <TranslatedText>Chargement des tentatives de quiz</TranslatedText>
            ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-quiz-attempts">
      <div className="attempts__header mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">
          <TranslatedText>
            Surveillez toutes les tentatives de quiz dans vos cours
          </TranslatedText>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search students, courses, or chapters..."
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
          />

          <select
            value={filters.courseId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, courseId: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
          >
            <option value="">
              <TranslatedText>Tous les cours</TranslatedText>
            </option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
          >
            <option value="all">
              <TranslatedText>Tous les statuts</TranslatedText>
            </option>
            <option value="passed">
              <TranslatedText>Réussi</TranslatedText>
            </option>
            <option value="failed">
              <TranslatedText>Échoué</TranslatedText>
            </option>
            <option value="restricted">
              <TranslatedText>Restreint</TranslatedText>
            </option>
          </select>

          <button
            onClick={fetchQuizAttempts}
            className="bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor/90 transition-colors"
          >
            <TranslatedText>Actualiser</TranslatedText>
          </button>

          <div className="text-sm text-gray-600">
            {filteredAttempts.length} <TranslatedText>Tentative</TranslatedText>
            {filteredAttempts.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {filteredAttempts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <i className="icofont-file-document text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            <TranslatedText>Aucune tentative de quiz trouvée</TranslatedText>
          </h3>
          <p className="text-gray-600">
            <TranslatedText>
              Aucune tentative de quiz ne correspond aux filtres actuels.
            </TranslatedText>
          </p>
        </div>
      ) : (
        <div className="attempts__list bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatedText>Étudiant</TranslatedText>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatedText>Cours</TranslatedText>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatedText>Chapitre</TranslatedText>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatedText>Score</TranslatedText>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatedText>Statut</TranslatedText>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatedText>Tentatives</TranslatedText>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatedText>Date</TranslatedText>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.studentEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attempt.courseName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attempt.chapterId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          attempt.score >= 60
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {attempt.score}%
                      </div>
                      {attempt.bestScore > 0 &&
                        attempt.bestScore !== attempt.score && (
                          <div className="text-xs text-gray-500">
                            <TranslatedText>Meilleur</TranslatedText>:{" "}
                            {attempt.bestScore}%
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(attempt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attempt.totalAttempts}
                        {attempt.isSummary && (
                          <div className="text-xs text-orange-600">
                            <TranslatedText>
                              Résumé des enregistrements
                            </TranslatedText>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(attempt.attemptedAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorQuizAttemsPrimary;
