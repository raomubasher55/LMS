"use client";
import { useState, useEffect } from "react";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import Link from "next/link";
import TranslatedText from "@/components/shared/TranslatedText";

const AdminFeedbacks = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) throw new Error("Authentication required");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/courses-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch course data");

        const data = await response.json();
        setCourses(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="text-primaryColor">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="icofont-star"></i>
        ))}
        {hasHalfStar && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-star-half w-14px inline-block"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
            <path d="M12 2V17.77" fill="currentColor"></path>
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-star w-14px inline-block"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
        <HeadingDashboard path="/courses">
          <TranslatedText>Total des retours</TranslatedText>
        </HeadingDashboard>
        <div className="flex justify-center py-10">
          <p>Loading course data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
        <HeadingDashboard path="/courses">
          <TranslatedText>Total des retours</TranslatedText>
        </HeadingDashboard>
        <div className="text-red-500 p-4">
          {typeof error === "string"
            ? error
            : error?.message || "An error occurred"}
          {(typeof error === "string" ? error : error?.message || "").includes(
            "Authentication"
          ) && (
            <Link
              href="/admin/login"
              className="block mt-2 text-blue-500 hover:underline"
            >
              <TranslatedText>Veuillez vous connecter</TranslatedText>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
      <HeadingDashboard path="/courses">
        <TranslatedText>Total des retours</TranslatedText>
      </HeadingDashboard>
      <div className="overflow-auto">
        <table className="w-full text-left text-nowrap">
          <thead className="text-sm md:text-base text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark leading-1.8 md:leading-1.8">
            <tr>
              <th className="px-5px py-10px md:px-5">
                <TranslatedText>Nom du cours</TranslatedText>
              </th>
              <th className="px-5px py-10px md:px-5">
                <TranslatedText>Inscrits</TranslatedText>
              </th>
              <th className="px-5px py-10px md:px-5">
                <TranslatedText>Note</TranslatedText>
              </th>
            </tr>
          </thead>
          <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <tr
                  key={course._id}
                  className={`leading-1.8 md:leading-1.8 ${
                    index % 2 === 0
                      ? "bg-lightGrey5 dark:bg-whiteColor-dark"
                      : ""
                  }`}
                >
                  <th className="px-5px py-10px md:px-5 font-normal">
                    <Link href={`/courses/${course._id}`}>
                      {course.title?.split(" ").slice(0, 7).join(" ") ||
                        "Untitled Course"}
                    </Link>
                  </th>
                  <td className="px-5px py-10px md:px-5">
                    <p>{course.enrolledStudents || 0}</p>
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    {renderStars(course.averageRating || 0)}
                    <span className="ml-2 text-sm text-gray-500">
                      ({course.averageRating?.toFixed(1) || "0.0"})
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  <TranslatedText>Aucun cours trouvé</TranslatedText>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeedbacks;
