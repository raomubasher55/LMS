"use client";
import { useState, useEffect } from "react";

const InstructorRecentActivity = () => {
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch recent courses
      const coursesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/instructor-courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        const courses = (coursesData.data || []).slice(0, 5); // Get 5 most recent
        setRecentCourses(courses);
      }

      // Fetch recent assignments for submission overview
      const assignmentsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/instructor/assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        const assignments = (assignmentsData.data || []).slice(0, 5);
        setRecentSubmissions(assignments);
      }

    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  if (loading) {
    return (
      <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-30px">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-30px">
      {/* Recent Courses */}
      <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-30px">
        <h3 className="text-size-22 font-bold text-blackColor dark:text-blackColor-dark leading-30px mb-25px">
          Recent Courses
        </h3>
        {recentCourses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No courses found. Create your first course to get started!</p>
        ) : (
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course._id} className="flex items-center justify-between p-4 border border-borderColor dark:border-borderColor-dark rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-blackColor dark:text-blackColor-dark mb-1">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Students: {course.enrollmentCount || 0}</span>
                    <span>Price: ${course.price || 0}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      course.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : course.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {course.status || 'draft'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Assignment Activity */}
      <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-30px">
        <h3 className="text-size-22 font-bold text-blackColor dark:text-blackColor-dark leading-30px mb-25px">
          Assignment Activity
        </h3>
        {recentSubmissions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No assignments found. Create assignments to track student submissions!</p>
        ) : (
          <div className="space-y-4">
            {recentSubmissions.map((assignment) => (
              <div key={assignment._id} className="flex items-center justify-between p-4 border border-borderColor dark:border-borderColor-dark rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-blackColor dark:text-blackColor-dark mb-1">
                    {assignment.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Submissions: {assignment.submissionCount || 0}</span>
                    <span>Max Points: {assignment.maxPoints || 'Not set'}</span>
                    {assignment.dueDate && (
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorRecentActivity;