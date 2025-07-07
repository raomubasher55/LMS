"use client"
import DropdownContainer from "@/components/shared/containers/DropdownContainer";
import Image from "next/image";
import React from "react";
import DropdownItems from "./DropdownItems";
import megaMenu2 from "@/assets/images/mega/mega_menu_2.png";
const DropdownPages = () => {
  const lists = [
    {
      title: "Get Started 1",
      items: [
        {
          name: "About",
          status: null,
          path: "/about",
        },
        {
          name: "Blog",
          status: null,
          path: "/blogs",
        },
      ],
    },
    // {
    //   title: "Get Started 2",
    //   items: [
    //     {
    //       name: "Error 404",
    //       status: null,
    //       path: "/error",
    //     },
    //     {
    //       name: "Event Details",
    //       status: null,
    //       path: "/events/1",
    //     },
    //     {
    //       name: "Zoom",
    //       status: "Online Call",
    //       path: "/zoom/meetings",
    //     },
    //     {
    //       name: "Zoom  Details",
    //       status: null,
    //       path: "/zoom/meetings/952428993687",
    //     },
    //   ],
    // },
    {
      title: "Get Started 2",
      items: [
        {
          name: "Login",
          status: null,
          path: "/login",
        },
        // {
        //   name: "Maintenance",
        //   status: null,
        //   path: "/maintenance",
        // },
        {
          name: "Terms & Condition",
          status: null,
          path: "/privacy-policy",
        },
      ],
    },
    {
      title: "Get Started 3",
      items: [
        {
          name: "Privacy Policy",
          status: null,
          path: "/privacy-policy",
        },
        {
          name: "Success Stories",
          status: null,
          path: "/success-stories",
        },
        // {
        //   name: "Work Policy",
        //   status: null,
        //   path: "/work-policy",
        // },
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
          prioriy="false"
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
