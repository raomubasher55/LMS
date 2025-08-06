"use client";
import { useState, useEffect } from "react";
import useEnrolledCourses from "@/hooks/useEnrolledCourses";
import axios from "axios";
import Link from "next/link";
import TranslatedText from "../TranslatedText";

const StudentDashboardSummary = () => {
  const { enrolledCourses, loading: coursesLoading } = useEnrolledCourses();
  const [stats, setStats] = useState({
    totalInvestment: 0,
    courseCount: 0,
    recentPurchases: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestmentStats = async () => {
      try {
        setLoading(true);
        
        // Get token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Make API request with token
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/enrollment/investment-stats`,
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        if (response.data && response.data.success) {
          setStats(response.data.data);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch investment stats');
        }
      } catch (err) {
        console.error('Error fetching investment stats:', err);
        setError(err?.message || String(err) || 'Failed to fetch investment stats');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Enrolled Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase font-semibold mb-2"><TranslatedText>Cours Totaux</TranslatedText></h3>
        <div className="flex items-center">
          <span className="text-4xl font-bold text-gray-800 dark:text-white">
            {coursesLoading ? (
              <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : (
              enrolledCourses.all.length
            )}
          </span>
        </div>
        <Link href="/dashboards/student-enrolled-courses" className="mt-4 text-primaryColor hover:underline text-sm">
          <TranslatedText>Voir Tous les Cours</TranslatedText>
        </Link>
      </div>

      {/* Active Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase font-semibold mb-2"><TranslatedText>Cours Actifs</TranslatedText></h3>
        <div className="flex items-center">
          <span className="text-4xl font-bold text-gray-800 dark:text-white">
            {coursesLoading ? (
              <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : (
              enrolledCourses.active.length
            )}
          </span>
        </div>
        <Link href="/dashboards/student-enrolled-courses" className="mt-4 text-primaryColor hover:underline text-sm">
          <TranslatedText>Continuer l'Apprentissage</TranslatedText>
        </Link>
      </div>

      {/* Completed Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase font-semibold mb-2"><TranslatedText>Cours Terminés</TranslatedText></h3>
        <div className="flex items-center">
          <span className="text-4xl font-bold text-gray-800 dark:text-white">
            {coursesLoading ? (
              <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : (
              enrolledCourses.completed.length
            )}
          </span>
        </div>
        <Link href="/dashboards/student-enrolled-courses" className="mt-4 text-primaryColor hover:underline text-sm">
          <TranslatedText>Voir les Certificats</TranslatedText>
        </Link>
      </div>

      {/* Total Investment */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase font-semibold mb-2"><TranslatedText>Investissement Total</TranslatedText></h3>
        <div className="flex items-center">
          <span className="text-4xl font-bold text-gray-800 dark:text-white">
            {loading ? (
              <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : (
              `$${stats.totalInvestment.toFixed(2)}`
            )}
          </span>
        </div>
        <span className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          {stats.courseCount} <TranslatedText>Cours Achetés</TranslatedText>
        </span>
      </div>
    </div>
  );
};

export default StudentDashboardSummary;