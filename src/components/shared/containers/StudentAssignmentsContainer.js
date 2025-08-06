import React from "react";
import StudentAssignmentResults from "../lesson-quiz/StudentAssignmentResults";
import HeadingDashboard from "../headings/HeadingDashboard";
import TranslatedText from "../TranslatedText";

const StudentAssignmentsContainer = ({ allResults, title }) => {
  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* heading */}
      <HeadingDashboard>{title ? title : <TranslatedText>Mes Devoirs</TranslatedText>}</HeadingDashboard>

      <hr className="my-4 border-contentColor opacity-35" />
      {/* main content */}
      <StudentAssignmentResults
        allResults={allResults}
        isHeading={false}
        title={"Assignments"}
      />
    </div>
  );
};

export default StudentAssignmentsContainer;