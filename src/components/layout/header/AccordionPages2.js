import React from "react";
import MobileAccordion from "./MobileAccordion";
import TranslatedText from "@/components/shared/TranslatedText";

const AccordionPages2 = () => {
  const items = [
    {
      name: <TranslatedText>À propos</TranslatedText>, // About
      path: "/about",
    },
    {
      name: <TranslatedText>Contact</TranslatedText>,
      path: "/contact",
    },
    {
      name: <TranslatedText>Instructeur</TranslatedText>, // Instructor
      path: "/instructors",
    },
    {
      name: <TranslatedText>Connexion</TranslatedText>, // Login
      path: "/login",
    },
    {
      name: <TranslatedText>Politique de confidentialité</TranslatedText>, // Privacy Policy
      path: "/privacy-policy",
    },
    {
      name: <TranslatedText>Histoires de réussite</TranslatedText>, // Success Stories
      path: "/success-stories",
    },
  ];

  return <MobileAccordion items={items} />;
};

export default AccordionPages2;
