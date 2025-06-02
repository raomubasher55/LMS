"use client";
import React, { useState } from "react";
import LessonAssignmentsResult from "../LessonAssiegnments/LessonAssignmentsResult";
import AssignmentsFilter from "../dashboards/AssignmentsFilter";
import HeadingDashboard from "../headings/HeadingDashboard";

const QuizContainers = ({ title }) => {
  const [courseId , setCourseId] = useState()

  const handleCourseSelect = (selectedCourseId) => {
    setCourseId(selectedCourseId);
  };

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* heading */}

      <HeadingDashboard>{title ? title : "Create Quizes"}</HeadingDashboard>

      {/* filter content */}
      <AssignmentsFilter
       onCourseSelect={handleCourseSelect}   />

      <hr className="my-4 border-contentColor opacity-35" />

      {/* main content */}
      <LessonAssignmentsResult courseId={courseId} />
    </div>
  );
};

export default QuizContainers;
