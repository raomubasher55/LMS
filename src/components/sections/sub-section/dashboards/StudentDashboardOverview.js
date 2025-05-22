"use client";
import React, { useState } from "react";
import StudentDashboardSummary from "@/components/shared/dashboards/StudentDashboardSummary";
import useEnrolledCourses from "@/hooks/useEnrolledCourses";
import CourseProgressCard from "@/components/shared/courses/CourseProgressCard";
import Link from "next/link";
import { migrateUserEnrollmentData } from "@/utils/migrateUserData";
import useSweetAlert from "@/hooks/useSweetAlert";

const StudentDashboardOverview = () => {
  const { enrolledCourses, loading, markCourseAsCompleted, refetch } = useEnrolledCourses();
  const [migrating, setMigrating] = useState(false);
  const createAlert = useSweetAlert();

  const handleMarkCompleted = async (courseId) => {
    await markCourseAsCompleted(courseId);
  };

  const handleMigrateData = async () => {
    try {
      setMigrating(true);
      const result = await migrateUserEnrollmentData();
      
      if (result.success) {
        createAlert('success', result.message);
        // Refresh the enrolled courses
        await refetch();
      }
    } catch (error) {
      createAlert('error', 'Failed to migrate data. Please try again.');
      console.error('Migration error:', error);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="dashboard-content p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Student Dashboard</h1>
        
        {/* Migration Button - Only show if no courses are showing */}
        {!loading && enrolledCourses.all && enrolledCourses.all.length === 0 && (
          <button
            onClick={handleMigrateData}
            disabled={migrating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {migrating ? 'Fixing Data...' : 'Fix Course Data'}
          </button>
        )}
      </div>
      
      {/* Summary Cards */}
      <StudentDashboardSummary />

      {/* In Progress Courses Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">In Progress Courses</h2>
          <Link 
            href="/dashboards/student-enrolled-courses" 
            className="text-primaryColor hover:underline text-sm"
          >
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
          </div>
        ) : enrolledCourses.active && enrolledCourses.active.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.active.slice(0, 3).map((course) => (
              <CourseProgressCard 
                key={course._id} 
                course={course} 
                onMarkCompleted={handleMarkCompleted}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any courses in progress.</p>
            <Link href="/courses" className="bg-primaryColor hover:bg-primaryColor/90 text-white px-4 py-2 rounded">
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      {/* Recently Completed Courses */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recently Completed</h2>
          <Link 
            href="/dashboards/student-enrolled-courses" 
            className="text-primaryColor hover:underline text-sm"
          >
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
          </div>
        ) : enrolledCourses.completed && enrolledCourses.completed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.completed.slice(0, 3).map((course) => (
              <CourseProgressCard 
                key={course._id} 
                course={course} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">You haven't completed any courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardOverview;