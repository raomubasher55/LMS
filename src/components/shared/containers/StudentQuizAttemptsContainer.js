import React from "react";
import StudentQuizResults from "../lesson-quiz/StudentQuizResults";
import HeadingDashboard from "../headings/HeadingDashboard";

const StudentQuizAttemptsContainer = ({ allResults, title }) => {
  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* heading */}
      <HeadingDashboard>{title ? title : "My Quiz Attempts"}</HeadingDashboard>

      <hr className="my-4 border-contentColor opacity-35" />
      {/* main content */}
      <StudentQuizResults
        allResults={allResults}
        isHeading={false}
        title={"Quiz Attempts"}
      />
    </div>
  );
};

export default StudentQuizAttemptsContainer;