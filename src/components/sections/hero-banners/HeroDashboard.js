"use client";
import React, { useEffect, useState } from "react";
import dashboardImage2 from "@/assets/images/dashbord/dashbord__2.jpg";
import teacherImage2 from "@/assets/images/teacher/teacher__2.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HeroDashboard = () => {
  const pathname = usePathname();
  const partOfPathNaem = pathname.split("/")[2]?.split("-")[0];

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("student");
  useEffect(() => {
    // Only runs in the browser
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    setRole(userData?.role || "student");
  }, []);

  const isAdmin = role === "admin";
  const isInstructor = role === "instructor";
  const imageUrl = user?.profile
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profile}`
    : isAdmin || isInstructor
    ? dashboardImage2
    : teacherImage2;
  return (
    <section>
      <div className="container-fluid-2">
        <div
          className={`${
            isAdmin
              ? "bg-primaryColor"
              : isInstructor
              ? "bg-naveBlue"
              : "bg-skycolor"
          } p-5 md:p-10 rounded-5 flex justify-center md:justify-between items-center flex-wrap gap-2`}
        >
          <div className="flex items-center flex-wrap justify-center sm:justify-start">
            <div className="mr-10px lg:mr-5">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="User profile"
                  width={108}
                  height={108}
                  className="w-27 h-27 md:w-22 md:h-22 lg:w-27 lg:h-27 rounded-full p-1 border-2 border-darkdeep7 box-content"
                />
              )}
            </div>
            <div className="text-whiteColor font-bold text-center sm:text-start">
              {isAdmin || isInstructor ? (
                <>
                  <h5 className="text-xl leading-1.2 mb-5px">Hello</h5>
                  <h2 className="text-2xl leading-1.24">
                    {user?.username
                      ? user.username.startsWith("@")
                        ? user.username
                        : `@${user.username}`
                      : "User"}
                  </h2>
                </>
              ) : (
                <>
                  <h5 className="text-2xl leading-1.24 mb-5px">
                    {user?.username || "Member"}
                  </h5>
                  <ul className="flex items-center gap-15px">
                    <li className="text-sm font-normal flex items-center gap-0.5">
                      {/* ... SVG */}
                      {user?.purchasedCourses?.length || 0} Courses Enrolled
                    </li>
                    <li className="text-sm font-normal flex items-center gap-0.5">
                      {/* ... SVG */}8 Certificates
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {isInstructor && (
            <div className="text-center">
              <div className="text-yellow">{/* ... stars */}</div>
              <p className="text-whiteColor">4.0 (120 Reviews)</p>
            </div>
          )}

          {!isAdmin && (
            <div>
              <Link
                href={isInstructor ? `/dashboards/create-course` : `/courses`}
                className={`text-size-15 border text-whiteColor ${
                  isInstructor
                    ? "bg-primaryColor border-primaryColor hover:text-primaryColor"
                    : "bg-secondaryColor border-secondaryColor hover:text-secondaryColor"
                } px-25px py-10px hover:bg-whiteColor rounded group text-nowrap flex gap-1 items-center`}
              >
                {isInstructor ? "Create a New Course" : "Enroll A New Course"}
                {/* ... arrow SVG */}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroDashboard;
