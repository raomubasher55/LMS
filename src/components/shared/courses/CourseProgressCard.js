"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CourseProgressCard = ({ course, onUpdateProgress, onMarkCompleted }) => {
  const {
    _id,
    title,
    bannerImage,
    category,
    language,
    price,
    discountedPrice,
    instructor,
    progress,
    totalDuration,
    totalChapters,
  } = course;

  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      className="rounded-md shadow-md dark:shadow-md-dark overflow-hidden mb-6"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        {/* Course Banner */}
        <div className="aspect-video relative">
          <Image
            src={
              bannerImage
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${bannerImage}`
                : "/placeholder-banner.jpg"
            }
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />

          {/* Progress Label */}
          <div className="absolute top-2 right-2 bg-primaryColor text-white text-xs px-2 py-1 rounded">
            {progress}% Complete
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="p-4">
        {/* Course Info */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs bg-secondaryColor/10 text-secondaryColor dark:text-secondaryColor-dark py-1 px-2 inline-block rounded">
              {category}
            </span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 py-1 px-2 inline-block rounded ml-2">
              {language}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/courses/${_id}`}>
          <h3 className="text-lg font-bold mt-2 mb-2 hover:text-primaryColor dark:hover:text-primaryColor-dark transition-all">
            {title}
          </h3>
        </Link>

        {/* Instructor */}
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full overflow-hidden relative mr-2">
            <Image
              src={
                instructor?.profile
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${instructor.profile}`
                  : "/default-avatar.png"
              }
              alt={instructor?.name}
              width={32}
              height={32}
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="text-sm">{instructor?.name}</span>
        </div>

        {/* Course Stats */}
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span>{totalChapters} chapters</span>
          <span></span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-2 mt-3">
          {progress < 100 ? (
            <>
              <Link
                href={`/courses/${_id}`}
                className="text-sm bg-primaryColor hover:bg-primaryColor/90 text-white px-3 py-2 rounded flex-1 text-center"
              >
                Continue Learning
              </Link>
              <button
                onClick={() => onMarkCompleted(_id)}
                className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-2 rounded flex-1"
              >
                Mark Complete
              </button>
            </>
          ) : (
            <Link
              href={`/courses/${_id}`}
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded w-full text-center"
            >
              Review Course
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseProgressCard;
