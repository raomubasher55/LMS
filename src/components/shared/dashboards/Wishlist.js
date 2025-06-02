"use client";

import { useEffect, useState } from "react";
import CourseCard from "../courses/CourseCard";
import HeadingDashboard from "../headings/HeadingDashboard";
import axios from "axios";

const Wishlist = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(response.data.wishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <HeadingDashboard>Wishlist</HeadingDashboard>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 -mx-15px">
          {courses.map((course, idx) => (
            <CourseCard key={idx} type="primary" instructor={course?.instructor} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
