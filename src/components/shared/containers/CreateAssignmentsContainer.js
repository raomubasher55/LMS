"use client";

import React, { useState } from "react";
import AssignmentsFilter from "../dashboards/AssignmentsFilter";
import HeadingDashboard from "../headings/HeadingDashboard";
import LessonAssignmentsUpload from '../LessonAssiegnments/LessonAssignmentsUpload'

const QuizContainers = ({ title }) => {
  const [CourseId, setSelectedCourseId] = useState("");

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
  };

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* heading */}
      <HeadingDashboard>{title ? title : "Create Assignments"}</HeadingDashboard>

      {/* filter content */}
      <AssignmentsFilter onCourseSelect={handleCourseSelect} />
      
      <hr className="my-4 border-contentColor opacity-35" />

      {/* main content */}
      
        <LessonAssignmentsUpload CourseId={CourseId} />
     
    </div>
  );
};

export default QuizContainers;
