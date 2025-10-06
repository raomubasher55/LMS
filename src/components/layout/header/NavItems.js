"use client";
import React, { useEffect, useState } from "react";
import Navitem from "./Navitem";
import DropdownPages from "./DropdownPages";
import DropdownCourses from "./DropdownCourses";
import DropdownWrapper from "@/components/shared/wrappers/DropdownWrapper";
import DropdownDashboard from "./DropdownDashboard";
import TranslatedText from "@/components/shared/TranslatedText";

const NavItems = () => {
  const [userExists, setUserExists] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    setUserExists(!!user);
  }, []);

  if (!mounted) return null;

  const navItems = [
    {
      id: 1,
      name: <TranslatedText>Accueil</TranslatedText>,
      path: "/",
    },
    {
      id: 2,
      name: <TranslatedText>À propos</TranslatedText>,
      path: "/about",
      dropdown: null,
      isRelative: false,
    },
    {
      id: 3,
      name: <TranslatedText>Contact</TranslatedText>,
      path: "/contact",
      dropdown: null,
      isRelative: false,
    },
    {
      id: 4,
      name: <TranslatedText>Services</TranslatedText>,
      path: "/services",
      dropdown: null,
      isRelative: false,
    },

    {
      id: 5,
      name: <TranslatedText>Cours</TranslatedText>,
      path: "/courses",
      dropdown: null,
      isRelative: false,
    },
    ...(userExists
      ? [
          {
            id: 6,
            name: <TranslatedText>Tableau de bord</TranslatedText>,
            path: "#",
            dropdown: <DropdownDashboard />,
            isRelative: true,
          },
        ]
      : []),
      ...(!userExists
      ? [
          {
            id: 7,
            name: <TranslatedText>S’inscrire</TranslatedText>,
            path: "/login",
            dropdown: null,
            isRelative: false,
          }
        ]      : []   
          )

  ];

  return (
    <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
      <ul className="nav-list flex justify-center">
        {navItems.map((navItem, idx) => (
          <Navitem key={idx} idx={idx} navItem={{ ...navItem, idx }}>
            <DropdownWrapper>{navItem.dropdown}</DropdownWrapper>
          </Navitem>
        ))}
      </ul>
    </div>
  );
};

export default NavItems;
