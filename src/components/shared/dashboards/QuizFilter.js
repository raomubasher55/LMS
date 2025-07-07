"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizFilter = ({ onCourseSelect, onLectureSelect }) => {
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLectureId, setSelectedLectureId] = useState("");

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
    const course = courses?.find((c) => c._id === courseId);
  
    // Fix: map chapters as lectures
    const lectures = course?.chapters?.map((ch) => ({
      _id: ch._id,
      title: ch.title,
    })) || [];
  
    setLectures(lectures);
    setSelectedLectureId("");
    onCourseSelect(courseId);
  };
  

  const handleLectureChange = (e) => {
    const lectureId = e.target.value;
    setSelectedLectureId(lectureId);
    onLectureSelect(lectureId); // Optional: send to parent
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

      {/* Lecture Dropdown */}
      <div className="xl:col-start-7 xl:col-span-3">
        <p className="text-xs uppercase text-bodyColor dark:text-blackColor-dark mb-6px font-semibold opacity-50">
          LECTURE
        </p>
        <div className="text-bodyColor dark:text-blackColor-dark border rounded-md relative">
          <select
            className="appearance-none bg-transparent text-bodyColor dark:text-blackColor-dark w-full p-13px rounded-md"
            value={selectedLectureId}
            onChange={handleLectureChange}
            disabled={!lectures.length}
          >
            <option className="text-bodyColor" value="">Select Lecture</option>
            {lectures.map((lecture) => (
              <option key={lecture._id} value={lecture._id} className="text-bodyColor">
                {lecture.title}
              </option>
            ))}
          </select>
          <i className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 text-lg"></i>
        </div>
      </div>
    </div>
  );
};

export default QuizFilter;
