"use client";

import { useState, useEffect } from "react";
import PublishContent from "./PublishContent";
import PendingContent from "./PendingContent";
import DraftContent from "./DraftContent";
import TabButtonSecondary from "../buttons/TabButtonSecondary";
import TabContentWrapper from "../wrappers/TabContentWrapper";
import useTab from "@/hooks/useTab";

const DashboardCoursesTab = ({ role }) => {
  const { currentIdx, handleTabClick } = useTab();
  const [courses, setCourses] = useState([]);
  const [instructor , setInstructor] = useState({})
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          console.error("No token found!");
          return;
        }

        const endpoint =
        role === "admin"
          ? "/api/admin/all-courses"
          : "/api/instructor-courses";

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setCourses(data.data); 
          setInstructor(data.instructor || {})
        } else {
          console.error("Failed to fetch courses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [role]);

  const publishCourses = courses?.filter((course) => course.status === "published");
  const pendingCourses = courses?.filter((course) => course.status === "pending");
  const RejectedCourses = courses?.filter((course) => course.status === "rejected");
  const tabbuttons = [
    {
      name: "PUBLISH",
      content: <PublishContent courses={publishCourses} instructor={instructor} role={role} />,
    },
    {
      name: "PENDING",
      content: <PendingContent courses={pendingCourses} instructor={instructor} role={role} />,
    },
    {
      name: "REJECTED",
      content: <DraftContent courses={RejectedCourses} instructor={instructor} role={role} />,
    },
  ];

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* heading */}
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          Course Status
        </h2>
      </div>

      <div>
        <div className="flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
          {tabbuttons.map(({ name }, idx) => (
            <TabButtonSecondary
              key={idx}
              name={name}
              idx={idx}
              currentIdx={currentIdx}
              handleTabClick={handleTabClick}
              button="small"
            />
          ))}
        </div>

        <div>
          {tabbuttons.map(({ content }, idx) => (
            <TabContentWrapper key={idx} isShow={idx === currentIdx}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:-mx-15px">
                {content}
              </div>
            </TabContentWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCoursesTab;
