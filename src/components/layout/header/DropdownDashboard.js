"use client";
import React, { useEffect, useState } from "react";
import DropdownPrimary from "./DropdownPrimary";
import TranslatedText from "@/components/shared/TranslatedText";

const DropdownDashboard = () => {
  const [userRole, setUserRole] = useState(null);

  const items = [
    {
      name: <TranslatedText>Admin</TranslatedText>,
      status: null,
      path: "/dashboards/admin-dashboard",
      type: "secondary",
      dropdown: [
        {
          name: <TranslatedText>Tableau Admin</TranslatedText>,
          status: null,
          path: "/dashboards/admin-dashboard",
          type: "secondary",
        },
        {
          name: <TranslatedText>Profil Admin</TranslatedText>,
          status: null,
          path: "/dashboards/admin-profile",
          type: "secondary",
        },
        {
          name: <TranslatedText>Messages</TranslatedText>,
          status: null,
          path: "/dashboards/admin-message",
          type: "secondary",
        },
        {
          name: <TranslatedText>Cours</TranslatedText>,
          status: null,
          path: "/dashboards/admin-course",
          type: "secondary",
        },
        {
          name: <TranslatedText>Avis</TranslatedText>,
          status: null,
          path: "/dashboards/admin-reviews",
          type: "secondary",
        },
        {
          name: <TranslatedText>Paramètres</TranslatedText>,
          status: null,
          path: "/dashboards/admin-settings",
          type: "secondary",
        },
      ],
    },
    {
      name: <TranslatedText>Instructor</TranslatedText>,
      status: null,
      path: "/dashboards/instructor-dashboard",
      type: "secondary",
      dropdown: [
        {
          name: <TranslatedText>Tableau Instructeur</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-dashboard",
          type: "secondary",
        },
        {
          name: <TranslatedText>Profil Instructeur</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-profile",
          type: "secondary",
        },
        {
          name: <TranslatedText>Messages</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-message",
          type: "secondary",
        },
        {
          name: <TranslatedText>Liste de souhaits</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-wishlist",
          type: "secondary",
        },
        {
          name: <TranslatedText>Avis</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-reviews",
          type: "secondary",
        },
        {
          name: <TranslatedText>Mon Quiz</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-my-quiz-attempts",
          type: "secondary",
        },
        {
          name: <TranslatedText>Historique des commandes</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-order-history",
          type: "secondary",
        },
        {
          name: <TranslatedText>Mes cours</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-course",
          type: "secondary",
        },
        {
          name: <TranslatedText>Annonces</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-announcments",
          type: "secondary",
        },
        {
          name: <TranslatedText>Tentatives de Quiz</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-quiz-attempts",
          type: "secondary",
        },
        {
          name: <TranslatedText>Devoir</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-assignments",
          type: "secondary",
        },
        {
          name: <TranslatedText>Paramètres</TranslatedText>,
          status: null,
          path: "/dashboards/instructor-settings",
          type: "secondary",
        },
      ],
    },
    {
      name: <TranslatedText>Student</TranslatedText>,
      status: null,
      path: "/dashboards/student-dashboard",
      type: "secondary",
      dropdown: [
        {
          name: <TranslatedText>Tableau de bord</TranslatedText>,
          status: null,
          path: "/dashboards/student-dashboard",
          type: "secondary",
        },
        {
          name: <TranslatedText>Profil</TranslatedText>,
          status: null,
          path: "/dashboards/student-profile",
          type: "secondary",
        },
        {
          name: <TranslatedText>Messages</TranslatedText>,
          status: null,
          path: "/dashboards/student-message",
          type: "secondary",
        },
        {
          name: <TranslatedText>Cours inscrits</TranslatedText>,
          status: null,
          path: "/dashboards/student-enrolled-courses",
          type: "secondary",
        },
        {
          name: <TranslatedText>Liste de souhaits</TranslatedText>,
          status: null,
          path: "/dashboards/student-wishlist",
          type: "secondary",
        },
        {
          name: <TranslatedText>Avis</TranslatedText>,
          status: null,
          path: "/dashboards/student-reviews",
          type: "secondary",
        },
        {
          name: <TranslatedText>Mon Quiz</TranslatedText>,
          status: null,
          path: "/dashboards/student-my-quiz-attempts",
          type: "secondary",
        },
        {
          name: <TranslatedText>Devoir</TranslatedText>,
          status: null,
          path: "/dashboards/student-assignments",
          type: "secondary",
        },
        {
          name: <TranslatedText>Paramètres</TranslatedText>,
          status: null,
          path: "/dashboards/student-settings",
          type: "secondary",
        },
      ],
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser?.role);
      }
    }
  }, []);

  const filteredItems = userRole
    ? items.filter(
        (item) =>
          item.name?.props?.children?.toLowerCase?.() === userRole.toLowerCase()
      )
    : [];

  return <DropdownPrimary items={filteredItems} />;
};

export default DropdownDashboard;
