"use client"
import React from "react";
import MobileAccordion from "./MobileAccordion";

const AccordionPages2 = () => {
  const items = [
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
    {
      name: "Instructors",
      path: "/instructors",
    },
    {
      name: "Event-Details",
      path: "/events/1",
    },
    {
      name: "Login",
      path: "/login",
    },
  ];
  return <MobileAccordion items={items} />;
};
export default AccordionPages2;
