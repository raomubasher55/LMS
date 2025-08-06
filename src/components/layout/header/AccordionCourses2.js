import React from "react";
import MobileAccordion from "./MobileAccordion";
import TranslatedText from "@/components/shared/TranslatedText";

const AccordionCourses2 = () => {
  const items = [
    {
      name: <TranslatedText>Cours</TranslatedText>, // Course
      path: "/courses",
    },
    {
      name: <TranslatedText>Liste des cours</TranslatedText>, // Course List
      path: "/course-list",
    },
    {
      name: <TranslatedText>Grille des cours</TranslatedText>, // Course Grid
      path: "/course-grid",
    },
    {
      name: <TranslatedText>Instructeur</TranslatedText>, // Instructor
      path: "/instructors",
    },
    {
      name: <TranslatedText>Devenir instructeur</TranslatedText>, // Become an Instructor
      path: "/become-an-instructor",
    },
  ];
  return <MobileAccordion items={items} />;
};

export default AccordionCourses2;
