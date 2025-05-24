"use client";
import React, { useEffect, useState } from "react";
import DropdownPrimary from "./DropdownPrimary";
const DropdownDashboard = () => {
  const [userRole, setUserRole] = useState(null);

  const items = [
    {
      name: "Admin",
      status: null,
      path: "/dashboards/admin-dashboard",
      type: "secondary",
      dropdown: [
        {
          name: "Admin Dashboard",
          status: null,
          path: "/dashboards/admin-dashboard",
          type: "secondary",
        },
        {
          name: "Admin Profile",
          status: null,
          path: "/dashboards/admin-profile",
          type: "secondary",
        },
        {
          name: "Message",
          status: null,
          path: "/dashboards/admin-message",
          type: "secondary",
        },
        {
          name: "Courses",
          status: null,
          path: "/dashboards/admin-course",
          type: "secondary",
        },
        {
          name: "Review",
          status: null,
          path: "/dashboards/admin-reviews",
          type: "secondary",
        },
        {
          name: "Setting",
          status: null,
          path: "/dashboards/admin-settings",
          type: "secondary",
        },
      ],
    },
    {
      name: "Instructor",
      status: null,
      path: "/dashboards/instructor-dashboard",
      type: "secondary",
      dropdown: [
        {
          name: "Ins. Dashboard",
          status: null,
          path: "/dashboards/instructor-dashboard",
          type: "secondary",
        },
        {
          name: "Ins. Profile",
          status: null,
          path: "/dashboards/instructor-profile",
          type: "secondary",
        },
        {
          name: "Message",
          status: null,
          path: "/dashboards/instructor-message",
          type: "secondary",
        },
        {
          name: "Wishlist",
          status: null,
          path: "/dashboards/instructor-wishlist",
          type: "secondary",
        },
        {
          name: "Review",
          status: null,
          path: "/dashboards/instructor-reviews",
          type: "secondary",
        },
        {
          name: "My Quiz",
          status: null,
          path: "/dashboards/instructor-my-quiz-attempts",
          type: "secondary",
        },
        {
          name: "Order History",
          status: null,
          path: "/dashboards/instructor-order-history",
          type: "secondary",
        },
        {
          name: "My Courses",
          status: null,
          path: "/dashboards/instructor-course",
          type: "secondary",
        },
        {
          name: "Announcements",
          status: null,
          path: "/dashboards/instructor-announcments",
          type: "secondary",
        },
        {
          name: "Quiz Attempt",
          status: null,
          path: "/dashboards/instructor-quiz-attempts",
          type: "secondary",
        },

        {
          name: "Assignment",
          status: null,
          path: "/dashboards/instructor-assignments",
          type: "secondary",
        },

        {
          name: "Setting",
          status: null,
          path: "/dashboards/instructor-settings",
          type: "secondary",
        },
      ],
    },
    {
      name: "Student",
      status: null,
      path: "/dashboards/student-dashboard",
      type: "secondary",
      dropdown: [
        {
          name: "Dashboard",
          status: null,
          path: "/dashboards/student-dashboard",
          type: "secondary",
        },
        {
          name: "Profile",
          status: null,
          path: "/dashboards/student-profile",
          type: "secondary",
        },
        {
          name: "Message",
          status: null,
          path: "/dashboards/student-message",
          type: "secondary",
        },
        {
          name: "Enrolled Courses",
          status: null,
          path: "/dashboards/student-enrolled-courses",
          type: "secondary",
        },
        {
          name: "Wishlist",
          status: null,
          path: "/dashboards/student-wishlist",
          type: "secondary",
        },
        {
          name: "Review",
          status: null,
          path: "/dashboards/student-reviews",
          type: "secondary",
        },
        {
          name: "My Quiz",
          status: null,
          path: "/dashboards/student-my-quiz-attempts",
          type: "secondary",
        },

        {
          name: "Assignment",
          status: null,
          path: "/dashboards/student-assignments",
          type: "secondary",
        },

        {
          name: "Setting",
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
  ? items.filter((item) => item.name.toLowerCase() === userRole)
  : [];

  return <DropdownPrimary items={filteredItems} />;
};

export default DropdownDashboard;
