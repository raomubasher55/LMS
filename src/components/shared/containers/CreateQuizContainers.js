"use client";

import React, { useState } from "react";
import LessonQuizUpload from "../lesson-quiz/LessonQuizUpload";
import QuizFilter from "../dashboards/QuizFilter";
import HeadingDashboard from "../headings/HeadingDashboard";

const CreateQuizContainers = ({ title }) => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedLectureId, setSelectedLectureId] = useState("");

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedLectureId(""); // Reset lecture when course changes
  };

  const handleLectureSelect = (lectureId) => {
    setSelectedLectureId(lectureId);
  };

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* heading */}
      <HeadingDashboard>{title || "Create Quizzes"}</HeadingDashboard>

      {/* filter content */}
      <QuizFilter
        onCourseSelect={handleCourseSelect}
        onLectureSelect={handleLectureSelect}
      />

      <hr className="my-4 border-contentColor opacity-35" />

      {/* main content (can be a quiz creation form here based on selections) */}
      {/* You can conditionally render the quiz form or preview here */}
      {/* Example: */}
      {selectedCourseId && selectedLectureId && (
        <LessonQuizUpload
          courseId={selectedCourseId}
          lectureId={selectedLectureId}
        />
      )}
    </div>
  );
};

export default CreateQuizContainers;
