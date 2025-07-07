"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import Image from "next/image";
import Link from "next/link";

const RecentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCourses = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/courses/recent`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 50
            }
          }
        );
        setCourses(res.data.data);
      } catch (error) {
        console.error("Error fetching recent courses:", error);
        setCourses([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCourses();
  }, []);

 const limitWords = (text, wordCount = 7) => {
  const words = text.split(' ');
  return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
};

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
        <HeadingDashboard path={"/courses"}>Recent Courses</HeadingDashboard>
        <div className="flex justify-center items-center h-40">
          <p>Loading recent courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
      <HeadingDashboard path={"/courses"}>Recent Courses</HeadingDashboard>
      
      {courses.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p>No recent courses found</p>
        </div>
      ) : (
        <ul>
          {courses.map((course, idx) => (
            <li
              key={course._id}
              className={`flex items-center flex-wrap ${
                idx === courses.length - 1
                  ? "pt-5"
                  : "py-5 border-b border-borderColor dark:border-borderColor-dark"
              }`}
            >
              {/* Course Image */}
              <div className="w-full md:w-30% md:pr-5">
                <Link className="w-full" href={`/courses/${course._id}`}>
                  <Image
                    src={course.bannerImage 
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.bannerImage}`
                      : "/default-course.jpg"}
                    alt={course.title}
                    width={200}
                    height={120}
                    className="w-full h-auto rounded object-cover"
                  />
                </Link>
              </div>
              
              {/* Course Details */}
              <div className="w-full md:w-70% md:pr-5">
                <div>
                  <h5 className="text-lg leading-1.5 font-medium text-contentColor dark:text-contentColor-dark mb-5px">
                    <Link
                      className="hover:text-primaryColor"
                      href={`/courses/${course._id}`}
                    >
                      {limitWords(course.title)}
                    </Link>
                  </h5>
                  <div className="flex flex-wrap items-center justify-between text-sm text-darkblack dark:text-darkblack-dark gap-x-15px gap-y-10px leading-1.8">
                    <p>
                      <i className="icofont-teacher mr-1"></i> 
                      {course.instructor?.name || "Unknown Instructor"}
                    </p>
                    <p>
                      <i className="icofont-book-alt mr-1"></i> 
                      {course.chapters?.length || 0} Lessons
                    </p>
                    <p>
                      <i className="icofont-clock-time mr-1"></i> 
                      {course.duration || "0h 0m"}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentCourses;