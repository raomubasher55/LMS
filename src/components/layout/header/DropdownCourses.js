"use client"
import DropdownContainer from "@/components/shared/containers/DropdownContainer";
import React from "react";
import DropdownItems from "./DropdownItems";
import Image from "next/image";
import megaMenu1 from "@/assets/images/mega/mega_menu_1.png";
const DropdownCourses = () => {
  const lists = [
    {
      title: "Get Started 1",
      items: [
        {
          name: "Grid",
          status: "All Coures",
          path: "/courses",
        },
        {
          name: "Coures Grid",
          status: null,
          path: "/course-grid",
        },
        {
          name: "Coures List",
          status: null,
          path: "/course-list",
        },
      ],
    },
    {
      title: "Get Started 2",
      items: [
        {
          name: "Courses",
          status: null,
          path: "/courses",
        },
      ],
    },
    {
      title: "Get Started 3",
      items: [
        {
          name: "Become An Instructor",
          status: null,
          path: "/dashboards/become-an-instructor",
        },
        {
          name: "Instructor",
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
            prioriy="false"
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
