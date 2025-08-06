"use client";
import { useEffect, useState } from "react";
import ImageSingle from "@/components/shared/sub-section/ImageSingle";
import { useRouter } from "next/navigation";

const ImageGallery = () => {
  const [recentBlogs, setRecentBlogs] = useState([]);
  const router = useRouter();
  useEffect(() => {
    fetchRecentBlogs();
  }, []);

  const fetchRecentBlogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/recent/list`);
      const data = await response.json();
      if (data.success) {
        setRecentBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleBlogClick = (slug) => {
    router.push(`/blogs/${slug}`);
  };

  return (
    <div>
      <div className="container-fluid-2 mb-10">
        <div className="gallary-container">
          <div className="grid grid-cols-2 gap-10px p-5 md:p-30px lg:p-5 2xl:p-30px border border-borderColor2 dark:border-borderColor2-dark">
            {recentBlogs.slice(0, 6).map((blog, idx) => (
              <div 
                key={idx} 
                onClick={() => handleBlogClick(blog.slug)}
                className="cursor-pointer"
              >
                <ImageSingle image={blog.featuredImage} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;