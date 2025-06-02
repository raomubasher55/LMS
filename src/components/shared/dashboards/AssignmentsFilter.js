"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignmentsFilter = ({ onCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor-courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(typeof res.data === "string" ? JSON.parse(res.data.data) : res.data.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    if (token) fetchCourses();
  }, []);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    onCourseSelect(courseId);
  };

  return (
    <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-12 gap-x-30px">
      {/* Course Dropdown */}
      <div className="xl:col-start-1 xl:col-span-6">
        <p className="text-xs uppercase text-bodyColor dark:text-blackColor-dark mb-6px font-semibold opacity-50">
          COURSES
        </p>
        <div className="text-bodyColor dark:text-blackColor-dark border rounded-md relative">
          <select
            className="appearance-none bg-transparent text-bodyColor dark:text-blackColor-dark w-full p-13px rounded-md"
            value={selectedCourseId}
            onChange={handleCourseChange}
          >
            <option className="text-bodyColor " value="">Select Course</option>
            {courses?.map((course) => (
              <option key={course._id} value={course._id} className="text-bodyColor">
                {course.title}
              </option>
            ))}
          </select>
          <i className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 text-lg"></i>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsFilter;
