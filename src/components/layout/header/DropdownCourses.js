"use client"
import DropdownContainer from "@/components/shared/containers/DropdownContainer";
import React from "react";
import DropdownItems from "./DropdownItems";
import Image from "next/image";
import megaMenu1 from "@/assets/images/mega/mega_menu_1.png";
import TranslatedText from "@/components/shared/TranslatedText";
const DropdownCourses = () => {
const lists = [
  {
    title: <TranslatedText>Commencer 1</TranslatedText>,
    items: [
      {
        name: <TranslatedText>Grille</TranslatedText>,
        status: <TranslatedText>Tous les cours</TranslatedText>,
        path: "/courses",
      },
      {
        name: <TranslatedText>Grille des cours</TranslatedText>,
        status: null,
        path: "/course-grid",
      },
      {
        name: <TranslatedText>Liste des cours</TranslatedText>,
        status: null,
        path: "/course-list",
      },
    ],
  },
  {
    title: <TranslatedText>Commencer 2</TranslatedText>,
    items: [
      {
        name: <TranslatedText>Cours</TranslatedText>,
        status: null,
        path: "/courses",
      },
    ],
  },
  {
    title: <TranslatedText>Commencer 3</TranslatedText>,
    items: [
      {
        name: <TranslatedText>Devenir instructeur</TranslatedText>,
        status: null,
        path: "/dashboards/become-an-instructor",
      },
      {
        name: <TranslatedText>Instructeur</TranslatedText>,
        status: null,
        path: "/instructors",
      },
    ],
  },
];

  return (
    <DropdownContainer>
      <div className="grid grid-cols-4 gap-x-30px">
        {lists?.map((list, idx) => (
          <DropdownItems key={idx} list={list} />
        ))}

        {/* dropdown banner */}
        <div>
          <Image
            priority={false}
            placeholder="blur"
            src={megaMenu1}
            alt="Mega Menu"
            className="w-full rounded-standard"
          />
        </div>
      </div>
    </DropdownContainer>
  );
};

export default DropdownCourses;
