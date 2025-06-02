"use client";
import { useEffect, useState } from "react";
import useTab from "@/hooks/useTab";
import TabButtonSecondary from "../buttons/TabButtonSecondary";
import StudentsContent from "./StudentsContent";
import InstructorRecord from "./InstructorRecord";
import AllUserContent from "./AllUserContent";
import TabContentWrapper from "../wrappers/TabContentWrapper";

const ReviewsTab = () => {
  const { currentIdx, handleTabClick } = useTab();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/all-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const allUsers = users;
  const students = users.filter((u) => u.role === "student");
  const instructors = users.filter((u) => u.role === "instructor");

  const tabbuttons = [
    {
      name: "All Users",
      content: <AllUserContent users={allUsers} />,
    },
    {
      name: "Students",
      content: <StudentsContent users={students} />,
    },
    {
      name: "Instructors",
      content: <InstructorRecord users={instructors} />,
    },
  ];

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          Users Management
        </h2>
      </div>

      <div>
        <div className="flex flex-wrap mb-10px lg:mb-50px rounded gap-15px md:gap-10px lg:gap-35px">
          {tabbuttons?.map(({ name }, idx) => (
            <TabButtonSecondary
              key={idx}
              name={name}
              currentIdx={currentIdx}
              idx={idx}
              handleTabClick={handleTabClick}
            />
          ))}
        </div>

        <div>
          {tabbuttons?.map(({ content }, idx) => (
            <TabContentWrapper key={idx} isShow={currentIdx === idx}>
              {content}
            </TabContentWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab;
