import Link from "next/link";
import React from "react";

const BlogTags2 = ({ tags }) => {
  return (
    <div>
      <ul className="flex flex-wrap gap-10px">
        <li>
          <p className="text-lg md:text-size-22 leading-7 md:leading-30px text-blackColor dark:text-blackColor-dark font-bold">
            Tags
          </p>
        </li>
        {tags && tags.length > 0 ? (
          tags.map((tag, index) => {
            if (tag.trim()) {  // Ignore empty strings
              return (
                <li key={index}>
                  <Link
                    href={`/courses?category=${tag.toLowerCase()}`}
                    className="px-2 py-5px md:px-3 md:py-9px text-contentColor text-size-11 md:text-xs font-medium uppercase border border-borderColor2 hover:text-whiteColor hover:bg-primaryColor hover:border-primaryColor dark:text-contentColor-dark dark:border-borderColor2-dark dark:hover:text-whiteColor dark:hover:bg-primaryColor dark:hover:border-primaryColor rounded"
                  >
                    {tag}
                  </Link>
                </li>
              );
            }
            return null; // Skip empty tags
          })
        ) : (
          <li>No tags available</li>
        )}
      </ul>
    </div>
  );
};

export default BlogTags2;
