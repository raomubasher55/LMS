"use client";

import Link from "next/link";
import React from "react";
import TranslatedText from "../TranslatedText";

const BlogTags = ({ blog, course }) => {
  return (
    <div
      className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-borderColor2-dark"
      data-aos="fade-up"
    >
      <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        <TranslatedText>Tag populaire</TranslatedText>

      </h4>
      {blog ? (
        <ul className="flex flex-wrap gap-x-5px">
          {blog?.tags?.map((tag, idx) => (
            <li key={idx}>
              <p className="m-5px px-19px py-3px text-contentColor text-xs font-medium uppercase border border-borderColor2 hover:text-whiteColor hover:bg-primaryColor hover:border-primaryColor leading-30px dark:text-contentColor-dark dark:border-borderColor2-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:hover:border-primaryColor">
                {tag}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-wrap gap-x-5px">
          {course?.tags?.map((tag, idx) => (
            <li key={idx}>
              <p className="m-5px px-19px py-3px text-contentColor text-xs font-medium uppercase border border-borderColor2 hover:text-whiteColor hover:bg-primaryColor hover:border-primaryColor leading-30px dark:text-contentColor-dark dark:border-borderColor2-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:hover:border-primaryColor">
                {tag}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogTags;
