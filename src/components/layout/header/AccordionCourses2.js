import React from "react";
import MobileAccordion from "./MobileAccordion";

const AccordionCourses2 = () => {
  const items = [
    {
      name: "Course",
      path: "/courses",
    },
    {
      name: "Course List",
      path: "/course-list",
    },
    {
      name: "Course Grid",
      path: "/course-grid",
    },
  ];
  return <MobileAccordion items={items} />;
};

export default AccordionCourses2;
