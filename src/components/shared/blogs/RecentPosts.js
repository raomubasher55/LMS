"use client"
// components/RecentPosts.js
import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";

// Fallback images
import blogImage11 from "@/assets/images/blog/blog_11.png";
import blogImage12 from "@/assets/images/blog/blog_12.png";
import blogImage13 from "@/assets/images/blog/blog_13.png";
import blogImage14 from "@/assets/images/blog/blog_14.png";

const RecentPosts = () => {
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback images array
  const fallbackImages = [blogImage11, blogImage12, blogImage13, blogImage14];

  useEffect(() => {
    let isMounted = true;

    const fetchRecentBlogs = async () => {
      try {
        console.log('Fetching recent blogs...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/recent/list`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Recent blogs API response:', data);
        
        if (isMounted) {
          if (data.success && Array.isArray(data.blogs)) {
            setRecentBlogs(data.blogs);
            console.log('Recent blogs set:', data.blogs);
          } else {
            throw new Error(data.message || 'Invalid response format');
          }
        }
      } catch (err) {
        console.error('Recent blogs fetch error:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecentBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get image URL or fallback
  const getImageSrc = (blog, index) => {
    if (blog.featuredImage) {
      // If it's a full URL, use it directly
      if (blog.featuredImage.startsWith('http')) {
        return blog.featuredImage;
      }
      // If it's a relative path, prepend API URL
      return `${process.env.NEXT_PUBLIC_API_URL}${blog.featuredImage}`;
    }
    // Use fallback image
    return fallbackImages[index % fallbackImages.length];
  };

  // Truncate title if too long
  const truncateTitle = (title, maxLength = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div
      className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-borderColor2-dark"
      data-aos="fade-up"
    >
      <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        Recent Posts
        {!loading && recentBlogs.length > 0 && (
          <span className="text-sm font-normal ml-2">({recentBlogs.length})</span>
        )}
      </h4>

      {loading ? (
        <div className="space-y-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center animate-pulse">
              <div className="w-2/5 pr-5">
                <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="w-3/5 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-sm mb-3">Failed to load recent posts</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primaryColor text-white rounded text-sm hover:bg-primaryColor/80 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : recentBlogs.length > 0 ? (
        <ul className="flex flex-col gap-y-25px">
          {recentBlogs.map((blog, idx) => (
            <li className="flex items-center" key={idx}>
              <div className="w-2/5 pr-5 relative">
                <Link href={`/blogs/${blog.slug}`} className="w-full block">
                  <div className="relative w-full h-16 overflow-hidden rounded">
                    <Image 
                      src={getImageSrc(blog, idx)} 
                      alt={blog.title || 'Blog post'}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to default image on error
                        e.target.src = fallbackImages[idx % fallbackImages.length];
                      }}
                    />
                  </div>
                </Link>
                <span className="text-xs font-medium text-whiteColor h-6 w-6 leading-6 text-center bg-primaryColor absolute -top-2 -left-2 rounded-full flex items-center justify-center">
                  {idx < 9 ? `0${idx + 1}` : idx + 1}
                </span>
              </div>
              <div className="w-3/5">
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="block text-xs text-contentColor font-medium leading-5 dark:text-contentColor-dark hover:text-primaryColor dark:hover:text-primaryColor mb-2"
                >
                  {formatDate(blog.createdAt)}
                </Link>
                <h3 className="font-bold leading-22px">
                  <Link
                    className="text-blackColor dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor transition-colors duration-200 text-sm"
                    href={`/blogs/${blog.slug}`}
                    title={blog.title}
                  >
                    {truncateTitle(blog.title)}
                  </Link>
                </h3>
                {blog.author && (
                  <p className="text-xs text-gray-500 mt-1">
                    by {blog.author.firstName} {blog.author.lastName}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No recent posts found</p>
          <p className="text-xs text-gray-400 mt-2">Recent posts will appear when blogs are published</p>
        </div>
      )}
    </div>
  );
};

export default RecentPosts;