"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import useSweetAlert from "@/hooks/useSweetAlert";
import TranslatedText from "@/components/shared/TranslatedText";

const InstructorStudentProgressMain = () => {
  const [studentProgress, setStudentProgress] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    courseId: "",
    studentId: "",
    restrictionStatus: "all", // all, restricted, unrestricted
  });
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState({});
  const createAlert = useSweetAlert();

  useEffect(() => {
    fetchCourses();
    fetchStudentProgress();
  }, []);

  useEffect(() => {
    fetchStudentProgress();
  }, [filters.courseId]);

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

  const fetchStudentProgress = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const params = new URLSearchParams();
      if (filters.courseId) params.append("courseId", filters.courseId);
      if (filters.studentId) params.append("studentId", filters.studentId);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/instructor/student-progress?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setStudentProgress(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching student progress:", error);
      createAlert("error", "Failed to load student progress");
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async (studentId, courseId, chapterId = null) => {
    const resetKey = `${studentId}-${courseId}-${chapterId || "all"}`;
    setResetting((prev) => ({ ...prev, [resetKey]: true }));

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const payload = { studentId, courseId };
      if (chapterId) payload.chapterId = chapterId;

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/instructor/reset-progress`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      createAlert(
        "success",
        chapterId
          ? "Chapter progress reset successfully"
          : "Course progress reset successfully"
      );
      await fetchStudentProgress();
    } catch (error) {
      console.error("Error resetting progress:", error);
      createAlert("error", "Failed to reset progress");
    } finally {
      setResetting((prev) => ({ ...prev, [resetKey]: false }));
    }
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

  const getRestrictionStatusColor = (restrictionStatus) => {
    if (restrictionStatus.needsInstructorApproval) return "red";
    if (restrictionStatus.needsVideoRewatch) return "blue";
    if (restrictionStatus.hasTimeRestriction) return "orange";
    return "green";
  };

  const getRestrictionStatusText = (restrictionStatus) => {
    if (restrictionStatus.needsInstructorApproval) return "Needs Approval";
    if (restrictionStatus.needsVideoRewatch) return "Video Rewatch Required";
    if (restrictionStatus.hasTimeRestriction) return "Time Restricted";
    return "No Restrictions";
  };

  const filteredStudents = studentProgress.filter((student) => {
    if (filters.restrictionStatus === "restricted") {
      return student.courses.some(
        (course) =>
          course.restrictionStatus.hasTimeRestriction ||
          course.restrictionStatus.needsVideoRewatch ||
          course.restrictionStatus.needsInstructorApproval
      );
    }
    if (filters.restrictionStatus === "unrestricted") {
      return !student.courses.some(
        (course) =>
          course.restrictionStatus.hasTimeRestriction ||
          course.restrictionStatus.needsVideoRewatch ||
          course.restrictionStatus.needsInstructorApproval
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="instructor-student-progress">
        <div className="progress__header mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            <TranslatedText>Progrès des étudiants</TranslatedText>
          </h2>
          <p className="text-gray-600">
            <TranslatedText>
              Suivez les progrès individuels des étudiants et leurs performances
              aux quiz
            </TranslatedText>
          </p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
          <p className="text-gray-600">
            <TranslatedText>
              Chargement du progrès des étudiants...
            </TranslatedText>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-student-progress">
      <div className="progress__header mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <TranslatedText>Progrès des étudiants</TranslatedText>
        </h2>
        <p className="text-gray-600">
          <TranslatedText>
            Suivez les progrès individuels des étudiants et leurs performances
            aux quiz
          </TranslatedText>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
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
            value={filters.restrictionStatus}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                restrictionStatus: e.target.value,
              }))
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primaryColor focus:border-transparent"
          >
            <option value="all">
              <TranslatedText>Tous les étudiants</TranslatedText>
            </option>
            <option value="restricted">
              <TranslatedText>Étudiants restreints</TranslatedText>
            </option>
            <option value="unrestricted">
              <TranslatedText>Étudiants non restreints</TranslatedText>
            </option>
          </select>

          <button
            onClick={fetchStudentProgress}
            className="bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor/90 transition-colors"
          >
            <TranslatedText>Actualiser</TranslatedText>
          </button>

          <div className="text-sm text-gray-600">
            {filteredStudents.length} <TranslatedText>Étudiant</TranslatedText>
            {filteredStudents.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <i className="icofont-users text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            <TranslatedText>Aucun étudiant trouvé</TranslatedText>
          </h3>
          <p className="text-gray-600">
            <TranslatedText>
              Aucun étudiant ne correspond aux filtres actuels.
            </TranslatedText>
          </p>
        </div>
      ) : (
        <div className="progress__list space-y-6">
          {filteredStudents.map((student) => (
            <div
              key={student.studentId}
              className="student-progress bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="student-header bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {student.studentName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {student.studentEmail}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {student.courses.length} course
                    {student.courses.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="student-courses p-6">
                {student.courses.map((course) => {
                  const statusColor = getRestrictionStatusColor(
                    course.restrictionStatus
                  );
                  const statusText = getRestrictionStatusText(
                    course.restrictionStatus
                  );

                  return (
                    <div
                      key={course.courseId}
                      className="course-progress mb-6 last:mb-0"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {course.courseName}
                          </h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">
                              <TranslatedText>Progrès global</TranslatedText>:{" "}
                              {course.overallProgress}%
                            </span>
                            <span
                              className={`text-sm px-2 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-700`}
                            >
                              {statusText}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleResetProgress(
                                student.studentId,
                                course.courseId
                              )
                            }
                            disabled={
                              resetting[
                                `${student.studentId}-${course.courseId}-all`
                              ]
                            }
                            className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
                          >
                            {resetting[
                              `${student.studentId}-${course.courseId}-all`
                            ]
                              ? "Resetting..."
                              : "Reset Course"}
                          </button>
                        </div>
                      </div>

                      {course.quizProgress.length > 0 ? (
                        <div className="quiz-progress-table bg-gray-50 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left">
                                  <TranslatedText>Chapitre</TranslatedText>
                                </th>
                                <th className="px-4 py-2 text-left">
                                  <TranslatedText>Tentatives</TranslatedText>
                                </th>
                                <th className="px-4 py-2 text-left">
                                  <TranslatedText>
                                    Meilleur score
                                  </TranslatedText>
                                </th>
                                <th className="px-4 py-2 text-left">
                                  <TranslatedText>Statut</TranslatedText>
                                </th>
                                <th className="px-4 py-2 text-left">
                                  <TranslatedText>
                                    Dernière tentative
                                  </TranslatedText>
                                </th>
                                <th className="px-4 py-2 text-left">
                                  <TranslatedText>Actions</TranslatedText>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {course.quizProgress.map((quiz) => (
                                <tr
                                  key={quiz.chapterId}
                                  className="border-t border-gray-200"
                                >
                                  <td className="px-4 py-2 font-medium">
                                    {quiz.chapterId}
                                  </td>
                                  <td className="px-4 py-2">
                                    {quiz.attemptsCount ||
                                      quiz.attempts?.length ||
                                      quiz.totalAttempts ||
                                      0}
                                    {quiz.totalAttempts > 0 &&
                                      (!quiz.attempts ||
                                        quiz.attempts.length === 0) && (
                                        <div className="text-xs text-orange-600">
                                          Total: {quiz.totalAttempts}
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-4 py-2">
                                    <span
                                      className={`font-medium ${
                                        quiz.bestScore >= 60
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {quiz.bestScore}%
                                    </span>
                                  </td>
                                  <td className="px-4 py-2">
                                    <div className="flex flex-col gap-1">
                                      {quiz.passed ? (
                                        <span className="text-green-600 font-medium">
                                          <TranslatedText>
                                            Réussi
                                          </TranslatedText>
                                        </span>
                                      ) : (
                                        <span className="text-red-600 font-medium">
                                          <TranslatedText>
                                            Échoué
                                          </TranslatedText>
                                        </span>
                                      )}
                                      {quiz.restrictionStatus
                                        .timeRestricted && (
                                        <span className="text-orange-600 text-xs">
                                          <TranslatedText>
                                            Temps limité
                                          </TranslatedText>
                                        </span>
                                      )}
                                      {quiz.restrictionStatus
                                        .videoReWatchRequired && (
                                        <span className="text-blue-600 text-xs">
                                          <TranslatedText>
                                            Revoir la vidéo
                                          </TranslatedText>
                                        </span>
                                      )}
                                      {quiz.restrictionStatus
                                        .instructorApprovalRequired && (
                                        <span className="text-red-600 text-xs">
                                          <TranslatedText>
                                            Besoin d'approbation
                                          </TranslatedText>
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 text-gray-600">
                                    {formatDate(quiz.lastAttemptAt)}
                                  </td>
                                  <td className="px-4 py-2">
                                    <button
                                      onClick={() =>
                                        handleResetProgress(
                                          student.studentId,
                                          course.courseId,
                                          quiz.chapterId
                                        )
                                      }
                                      disabled={
                                        resetting[
                                          `${student.studentId}-${course.courseId}-${quiz.chapterId}`
                                        ]
                                      }
                                      className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                                    >
                                      {resetting[
                                        `${student.studentId}-${course.courseId}-${quiz.chapterId}`
                                      ]
                                        ? "Resetting..."
                                        : "Reset"}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                          <TranslatedText>
                            Aucune tentative de quiz pour le moment
                          </TranslatedText>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorStudentProgressMain;
