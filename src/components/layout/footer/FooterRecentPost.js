
"use client"
import useIsSecondary from "@/hooks/useIsSecondary";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FooterRecentPost = ({ course }) => {
  const { title, createdAt, bannerImage, id } = course;
  return (
    <li>
      <Link
        href={`/courses/${id}`}
        className="flex items-center gap-3 group cursor-pointer"
      >
        <div>
          <Image
            src={bannerImage 
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${bannerImage}` 
              : '/placeholder-course.jpg'}
            alt=""
            className="w-61px h-54px"
            width={100}
            height={100}
          />
        </div>
        <div>
          <p className="text-xs text-darkgray mb-7px">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(createdAt))}
          </p>
          <h6 className="text-size-15 dark:text-whiteColor text-primaryColor font-bold group-hover:text-primaryColor transition-all duration-300">
            {title.length > 18 ? `${title.slice(0, 18)}...` : title}
          </h6>
        </div>
      </Link>
    </li>
  );
};

export default FooterRecentPost;
