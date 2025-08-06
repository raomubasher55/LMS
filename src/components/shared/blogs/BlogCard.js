import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  const formatContent = (content, length = 150) => {
    if (!content) return '';
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return textContent.length > length 
      ? textContent.substring(0, length) + '...' 
      : textContent;
  };

  const { day, month } = formatDate(blog.createdAt);
  const displayContent = blog.excerpt || formatContent(blog.content);

  return (
    <div className="group shadow-blog2 bg-whiteColor dark:bg-whiteColor-dark rounded-lg overflow-hidden" data-aos="fade-up">
      {/* blog thumbnail */}
      <div className="overflow-hidden relative">
        {blog.featuredImage ? (
          <Image 
            src={`${process.env.NEXT_PUBLIC_API_URL}${blog.featuredImage}`}
            alt={blog.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}
        
        {/* Date Badge */}
        <div className="text-size-22 leading-6 font-semibold text-white px-15px py-5px md:px-6 md:py-2 bg-primaryColor rounded text-center absolute top-5 right-5">
          <h3>
            {day} <br />
            {month}
          </h3>
        </div>
      </div>
      
      {/* blog content */}
      <div className="pt-26px pb-5 px-30px">
        {/* Category */}
        {blog.category && (
          <div className="mb-3">
            <span className="px-3 py-1 bg-primaryColor/10 text-primaryColor text-sm font-medium rounded-full">
              {blog.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl md:text-size-32 lg:text-size-28 2xl:text-size-34 leading-34px md:leading-10 2xl:leading-13.5 font-bold text-blackColor2 hover:text-primaryColor dark:text-blackColor2-dark dark:hover:text-primaryColor mb-4">
          <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
        </h3>

        {/* Meta Info */}
        <div className="mb-14px pb-19px border-b border-borderColor dark:border-borderColor-dark">
          <ul className="flex flex-wrap items-center gap-x-15px text-sm">
            <li>
              <span className="text-contentColor dark:text-contentColor-dark flex items-center">
                <i className="icofont-business-man-alt-2 mr-1"></i>
                By {blog.author?.name || 'Anonymous'}
              </span>
            </li>
            <li>
              <span className="text-contentColor dark:text-contentColor-dark flex items-center">
                <i className="icofont-eye mr-1"></i>
                {blog.views || 0} Views
              </span>
            </li>
            {blog.isCommentEnabled && (
              <li>
                <span className="text-contentColor dark:text-contentColor-dark flex items-center">
                  <i className="icofont-speech-comments mr-1"></i>
                  Comments
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Content Preview */}
        <p className="text-contentColor dark:text-contentColor-dark leading-7 mb-6">
          {displayContent}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                  +{blog.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Read More Button */}
        <div>
          <Link
            href={`/blogs/${blog.slug}`}
            className="text-primaryColor hover:text-primaryColor/80 font-medium inline-flex items-center group"
          >
            Read More
            <i className="icofont-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;