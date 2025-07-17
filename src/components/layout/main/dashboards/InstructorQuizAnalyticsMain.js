"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import useSweetAlert from "@/hooks/useSweetAlert";
import TranslatedText from "@/components/shared/TranslatedText";

const InstructorQuizAnalyticsMain = () => {
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const createAlert = useSweetAlert();

  useEffect(() => {
    fetchCourses();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedCourse !== "") {
      fetchAnalytics(selectedCourse);
    }
  }, [selectedCourse]);

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

  const fetchAnalytics = async (courseId = null) => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const url = courseId
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/instructor/analytics?courseId=${courseId}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/instructor/analytics`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      createAlert("error", "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = "blue" }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}
        >
          <i className={`icofont-${icon} text-${color}-600 text-xl`}></i>
        </div>
      </div>
    </div>
  );

  const RestrictionStatCard = ({ title, count, color, icon }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}
        >
          <i className={`icofont-${icon} text-${color}-600`}></i>
        </div>
        <div>
          <p className={`text-${color}-800 font-medium`}>{count}</p>
          <p className={`text-${color}-600 text-sm`}>{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="instructor-quiz-analytics">
        <div className="analytics__header mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            <TranslatedText>Analyse des quiz</TranslatedText>
          </h2>
          <p className="text-gray-600">
            <TranslatedText>
              Aperçu complet des performances aux quiz et des progrès des
              étudiants
            </TranslatedText>
          </p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
          <p className="text-gray-600">
            <TranslatedText>Chargement des analyses...</TranslatedText>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-quiz-analytics">
      <div className="analytics__header mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <TranslatedText>Analyse des quiz</TranslatedText>
        </h2>
        <p className="text-gray-600">
          <TranslatedText>
            Aperçu complet des performances aux quiz et des progrès des
            étudiants
          </TranslatedText>
        </p>

        <div className="mt-4 flex items-center gap-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
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
          <button
            onClick={() => fetchAnalytics(selectedCourse || null)}
            className="bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor/90 transition-colors"
          >
            <TranslatedText>Actualiser</TranslatedText>
          </button>
        </div>
      </div>

      {analytics && (
        <div className="analytics__content space-y-8">
          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <TranslatedText>Vue d'ensemble des performances</TranslatedText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title={
                  <TranslatedText>Nombre total d'étudiants</TranslatedText>
                }
                value={analytics.performanceMetrics.totalStudents}
                icon="users-alt-4"
                color="blue"
              />
              <StatCard
                title={<TranslatedText>Taux moyen de réussite</TranslatedText>}
                value={`${analytics.performanceMetrics.averagePassRate}%`}
                icon="check-circled"
                color="green"
              />
              <StatCard
                title={<TranslatedText>Score moyen</TranslatedText>}
                value={`${analytics.performanceMetrics.averageScore}%`}
                icon="star"
                color="yellow"
              />
              <StatCard
                title={<TranslatedText>Total des tentatives</TranslatedText>}
                value={analytics.performanceMetrics.totalQuizAttempts}
                icon="refresh"
                color="purple"
              />
            </div>
          </div>

          {/* Restriction Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <TranslatedText>Restrictions des étudiants</TranslatedText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <RestrictionStatCard
                title={<TranslatedText>Temps limité</TranslatedText>}
                count={analytics.restrictionStats.studentsInTimeRestriction}
                color="orange"
                icon="clock-time"
              />
              <RestrictionStatCard
                title={
                  <TranslatedText>Nécessite de revoir la vidéo</TranslatedText>
                }
                count={analytics.restrictionStats.studentsRequiringVideoRewatch}
                color="blue"
                icon="video-cam"
              />
              <RestrictionStatCard
                title={<TranslatedText>Total restreints</TranslatedText>}
                count={analytics.restrictionStats.totalStudentsWithRestrictions}
                color="gray"
                icon="lock"
              />
            </div>
          </div>

          {/* Course Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <TranslatedText>Performance des cours</TranslatedText>
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatedText>Cours</TranslatedText>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatedText>Étudiants</TranslatedText>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatedText>Chapitres</TranslatedText>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatedText>Taux de réussite</TranslatedText>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatedText>Score moyen</TranslatedText>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatedText>Quizzes tentés</TranslatedText>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.courseOverview.map((course) => (
                      <tr key={course.courseId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {course.courseName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {course.studentsEnrolled}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {course.totalChapters}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              course.completionStats.passRate >= 80
                                ? "bg-green-100 text-green-800"
                                : course.completionStats.passRate >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {course.completionStats.passRate}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {course.completionStats.averageScore}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {course.completionStats.quizzesAttempted}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {analytics.courseOverview.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    <TranslatedText>
                      Aucune donnée de cours disponible
                    </TranslatedText>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!analytics && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <i className="icofont-chart-line text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            <TranslatedText>Aucune donnée analytique</TranslatedText>
          </h3>
          <p className="text-gray-600">
            <TranslatedText>
              Commencez à enseigner des cours pour voir les analyses ici.
            </TranslatedText>
          </p>
        </div>
      )}
    </div>
  );
};

export default InstructorQuizAnalyticsMain;
