"use client"
import DropdownContainer from "@/components/shared/containers/DropdownContainer";
import Image from "next/image";
import React from "react";
import DropdownItems from "./DropdownItems";
import megaMenu2 from "@/assets/images/mega/mega_menu_2.png";
import TranslatedText from "@/components/shared/TranslatedText";
const DropdownPages = () => {
const lists = [
  {
    title: <TranslatedText>Commencer 1</TranslatedText>,
    items: [
      {
        name: <TranslatedText>À propos</TranslatedText>,
        status: null,
        path: "/about",
      },
      {
        name: <TranslatedText>Blog</TranslatedText>,
        status: null,
        path: "/blogs",
      },
    ],
  },
  {
    title: <TranslatedText>Commencer 2</TranslatedText>,
    items: [
      {
        name: <TranslatedText>Connexion</TranslatedText>,
        status: null,
        path: "/login",
      },
      {
        name: <TranslatedText>Termes et conditions</TranslatedText>,
        status: null,
        path: "/privacy-policy",
      },
    ],
  },
  {
    title: <TranslatedText>Commencer 3</TranslatedText>,
    items: [
      {
        name: <TranslatedText>Politique de confidentialité</TranslatedText>,
        status: null,
        path: "/privacy-policy",
      },
      {
        name: <TranslatedText>Histoires de réussite</TranslatedText>,
        status: null,
        path: "/success-stories",
      },
    ],
  },
    {
    title: <TranslatedText>Commencer 4</TranslatedText>,
    items: [
      {
        name: <TranslatedText>Services</TranslatedText>,
        status: null,
        path: "/services",
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
      </div>
      {/* dropdown banner */}
      <div className="pt-30px">
        <Image
          priority={false}
          placeholder="blur"
          src={megaMenu2}
          alt="Mega Menu"
          className="w-full rounded-standard"
        />
      </div>
    </DropdownContainer>
  );
};

export default DropdownPages;
