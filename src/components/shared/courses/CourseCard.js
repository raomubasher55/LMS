"use client";
import { useWishlistContext } from "@/contexts/WshlistContext";
import useSweetAlert from "@/hooks/useSweetAlert";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaEllipsisV } from "react-icons/fa";
import TranslatedText from "../TranslatedText";

const CourseCard = ({ course, instructor, type, role }) => {
  const { addProductToWishlist } = useWishlistContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [status, setStatus] = useState(course?.status);
  const createAlert = useSweetAlert();
  const {
    _id: id,
    title,
    price,
    discountedPrice,
    category,
    bannerImage,
    totalDuration,
    offerType,
    language,
  } = course;

  // Calculate if course is free
  const isFree = offerType === "free";
  

  const insName =
    instructor?.name ||
    course?.instructor?.Name ||
    `${course?.instructor?.firstName}`;

  function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }

  CourseCard.propTypes = {
    course: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["primary", "primaryMd", "lg"]),
  };

  const courseId = course._id;

  const handleStatusChange = async (newStatus) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${courseId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus(newStatus);
        setIsMenuOpen(false);
        createAlert(
          "success",
          data.message || "Course status updated successfully!"
        );
        window.location.reload(); // Optional: remove this and use state update if possible
      } else {
        console.error("Failed to update course status:", data.message);
        createAlert("error", data.message || "Already updated.");
      }
    } catch (error) {
      console.error("Error updating course status:", error);
      createAlert("error", "Server error while updating course.");
    }
  };

  return (
    <div
      className={`group ${
        type === "primary" || type === "primaryMd"
          ? ""
          : `w-full sm:w-1/2 lg:w-1/3 grid-item ${
              type === "lg" ? "xl:w-1/4" : ""
            }`
      }`}
    >
      <div className={`${type === "primaryMd" ? "" : "sm:px-15px mb-30px"}`}>
        <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
          {/* card image */}
          <div className="relative mb-2">
            <Link
              href={`/courses/${id}`}
              className="w-full overflow-hidden rounded"
            >
              {bannerImage && (
                <Image
                  src={
                    bannerImage
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${bannerImage}`
                      : "/placeholder-course.jpg"
                  }
                  alt="Course Banner"
                  width={400}
                  height={225}
                  className="w-full h-auto transition-all duration-300 group-hover:scale-110"
                  unoptimized
                  priority
                />
              )}
            </Link>
            {role === "admin" ? (
              <div className="absolute right-0 top-1 flex justify-between w-max items-center px-2">
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="text-gray-100 hover:text-gray-100"
                >
                  <FaEllipsisV size={20} />
                </button>
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-2 bg-white shadow-md rounded mt-2 w-40">
                    <ul className="flex flex-col">
                      <li
                        onClick={() => handleStatusChange("pending")}
                        className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                      >
                        <TranslatedText>En attente</TranslatedText>
                      </li>
                      <li
                        onClick={() => handleStatusChange("published")}
                        className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                      >
                        <TranslatedText>Publié</TranslatedText>
                      </li>
                      <li
                        onClick={() => handleStatusChange("rejected")}
                        className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                      >
                        <TranslatedText>Rejeté</TranslatedText>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute left-0 top-0 flex justify-between w-full items-center px-2">
                <div>
                  <p className="text-xs text-whiteColor px-4 py-[3px] rounded font-semibold bg-primaryColor">
                    {category}
                  </p>
                </div>
                <button
                  onClick={() => addProductToWishlist({ id })}
                  className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor"
                >
                  <i className="icofont-heart-alt text-base py-1 px-2"></i>
                </button>
              </div>
            )}
          </div>

          {/* card content */}
          <div>
            <div className="grid grid-cols-2 mb-3">
              <div className="flex items-center">
                <div>
                  <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                </div>
                <div>
                  <span className="text-sm text-black dark:text-blackColor-dark line-clamp-1">
                    {language}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div>
                  <i className="icofont-clock-time pr-5px text-primaryColor text-lg"></i>
                </div>
                <div>
                  <span className="text-sm text-black dark:text-blackColor-dark">
                    {formatDuration(totalDuration)}
                  </span>
                </div>
              </div>
            </div>

            <h5 className={`${type === "primaryMd" ? "text-lg" : "text-xl"}`}>
              <Link
                href={`/courses/${id}`}
                className={`font-semibold text-blackColor mb-10px dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor ${
                  type === "primaryMd" ? "leading-25px" : "leading-27px"
                }`}
              >
                {title}
              </Link>
            </h5>

            {/* price */}
            <div className="text-lg font-semibold text-primaryColor mb-4">
              $
              {discountedPrice
                ? discountedPrice?.toFixed(1)
                : price?.toFixed(1)}
              {discountedPrice && (
                <del className="text-sm text-lightGrey4 font-semibold ml-2">
                  ${price?.toFixed(1)}
                </del>
              )}
              <span
                className={`ml-6 text-base font-semibold ${
                  isFree ? "text-green-500" : "text-secondaryColor3"
                }`}
              >
                {isFree ? "Free" : "Premium"}
              </span>
            </div>

            {/* author and rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 pt-15px border-t border-borderColor">
              <div>
                <h6>
                  <Link
                    href={`/instructors/${instructor?.id || "#"}`}
                    className="text-base font-bold flex items-center hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor"
                  >
                    {course && (
                      <Image
                        className="w-[30px] h-[30px] rounded-full mr-15px"
                        src={
                          instructor?.profile
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${instructor.profile}`
                            : `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/Sample_User_Icon.png`
                        }
                        alt={insName}
                        width={30}
                        height={30}
                        unoptimized
                      />
                    )}
                    <span className="whitespace-nowrap">
                      {`${insName?.split(" ")[0] || ""} ${
                        insName?.split(" ")[1]?.slice(0, 0) || ""
                      }...`}
                    </span>
                  </Link>
                </h6>
              </div>
              <div className="text-start md:text-end space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`icofont-star text-size-15 ${
                      star <= (course.rating || 0)
                        ? "text-[#F59E0B]"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                {/* Show total reviews count */}
                <span className="text-xs text-lightGrey6">
                  ({course.totalReviews || 0}){" "}
                  {/* Display total reviews count */}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
