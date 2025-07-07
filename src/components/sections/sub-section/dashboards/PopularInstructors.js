"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import Image from "next/image";
import Link from "next/link";

const PopularInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
console.log(instructors)
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/instructors/top`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInstructors(res.data.data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
        <HeadingDashboard path={`/instructors`}>
          Popular Instructor
        </HeadingDashboard>
        <div className="flex justify-center items-center h-40">
          <p>Loading instructors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
      <HeadingDashboard path={`/instructors`}>
        Popular Instructor
      </HeadingDashboard>

      {/* instructors list */}
      <ul>
        {instructors?.map(
          ({ _id, firstName, lastName, profile, reviewCount, studentCount, courseCount }, idx) => (
            <li
              key={_id}
              className={`flex items-center flex-wrap  ${
                idx === instructors?.length - 1
                  ? "pt-15px"
                  : "py-15px border-b border-borderColor dark:border-borderColor-dark"
              }`}
            >
              {/* avatar */}
              <div className="max-w-full md:max-w-1/5 pr-10px">
                <Image 
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${profile}`}
                  alt={`${firstName} ${lastName}`} 
                  width={80} 
                  height={80}
                  className="w-20 h-16 overflow-hidden rounded-full object-cover"
                />
              </div>
              {/* details */}
              <div className="max-w-full md:max-w-4/5 pr-10px">
                <div>
                  <h5 className="text-lg leading-1 font-bold text-contentColor dark:text-contentColor-dark mb-5px">
                    <Link
                      className="hover:text-primaryColor"
                      href={`/instructors/${_id}`}
                    >
                      {firstName} {lastName}
                    </Link>
                  </h5>
                  <div className="flex flex-wrap items-center text-sm text-darkblack dark:text-darkblack-dark gap-x-15px gap-y-10px leading-1.8">
                    <p>
                      <i className="icofont-chat"></i> {reviewCount?.toLocaleString() || 0} Reviews
                    </p>
                    <p>
                      <i className="icofont-student-alt"></i> {studentCount?.toLocaleString() || 0} Students
                    </p>
                    <p>
                      <i className="icofont-video-alt"></i> {courseCount || 0} Courses
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default PopularInstructors;