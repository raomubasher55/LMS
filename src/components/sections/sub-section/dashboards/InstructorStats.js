"use client";
import { useState, useEffect } from "react";
import CounterDashboard from "@/components/shared/dashboards/CounterDashboard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import counter1 from "@/assets/images/counter/counter__1.png";
import counter2 from "@/assets/images/counter/counter__2.png";
import counter3 from "@/assets/images/counter/counter__3.png";
import counter4 from "@/assets/images/counter/counter__4.png";
import TranslatedText from "@/components/shared/TranslatedText";

const InstructorStats = () => {
  console.log("InstructorStats component rendering...");
  
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    pendingSubmissions: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchInstructorStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found");
        return;
      }

      console.log("Fetching instructor courses...");
      // Fetch instructor courses
const coursesResponse = await fetch(
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor-courses`,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);

      let totalStudents = 0;
      let activeCourses = 0;
      let totalCourses = 0;

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        const courses = coursesData.data || [];
        totalCourses = courses.length;
        activeCourses = courses.filter(course => course.status === 'published').length;
        totalStudents = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
      } else {
        console.error('Failed to fetch courses:', coursesResponse.status);
      }

      // Fetch pending assignment submissions
      const assignmentsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/instructor/assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let pendingSubmissions = 0;
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        const assignments = assignmentsData.data || [];
        pendingSubmissions = assignments.reduce((sum, assignment) => sum + (assignment.submissionCount || 0), 0);
      } else {
        console.error('Failed to fetch assignments:', assignmentsResponse.status);
      }

      // Fetch instructor reviews
      const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let totalReviews = 0;
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        totalReviews = reviewsData.data?.length || 0;
      } else {
        console.error('Failed to fetch reviews:', reviewsResponse.status);
      }

      setStats({
        totalCourses,
        activeCourses,
        totalStudents,
        totalRevenue: 0, // This would need a revenue endpoint
        pendingSubmissions,
        totalReviews
      });

    } catch (error) {
      console.error('Error fetching instructor stats:', error);
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorStats();
  }, []);

  console.log("Rendering counts with loading:", loading, "stats:", stats);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Loading Instructor Stats...</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-gray-200 h-20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

const counts = [
  {
    name: <TranslatedText>Total des cours</TranslatedText>,
    image: counter1,
    data: stats.totalCourses,
    symbol: "",
  },
  {
    name: <TranslatedText>Cours actifs</TranslatedText>,
    image: counter2,
    data: stats.activeCourses,
    symbol: "",
  },
  {
    name: <TranslatedText>Total des étudiants</TranslatedText>,
    image: counter3,
    data: stats.totalStudents,
    symbol: "",
  },
  {
    name: <TranslatedText>Soumissions en attente</TranslatedText>,
    image: counter4,
    data: stats.pendingSubmissions,
    symbol: "",
  },
  {
    name: <TranslatedText>Total des avis</TranslatedText>,
    image: counter1,
    data: stats.totalReviews,
    symbol: "",
  },
  {
    name: <TranslatedText>Note du cours</TranslatedText>,
    image: counter2,
    data: "4.5",
    symbol: "⭐",
  },
];

return (
  <CounterDashboard counts={counts}>
    <HeadingDashboard>
      <TranslatedText>Tableau de bord de l'instructeur</TranslatedText>
    </HeadingDashboard>
  </CounterDashboard>
);

};

export default InstructorStats;