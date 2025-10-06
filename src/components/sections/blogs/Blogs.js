"use client";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import SectionName from "@/components/shared/section-names/SectionName";
import Image from "next/image";
import Link from "next/link";
import useIsTrue from "@/hooks/useIsTrue";
import { useState, useEffect } from "react";
import TranslatedText from "@/components/shared/TranslatedText";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs?limit=3&sortBy=createdAt&sortOrder=desc`);
        const data = await response.json();
        
        if (data.success) {
          console.log(data.blogs)
          setBlogs(data.blogs);
        } else {
          setError(data.message || 'Failed to fetch blogs');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    return { date: day, month };
  };

  // Show loading state
  if (loading) {
    return (
      <section>
        <div className="container py-100px">
          <div className="mb-5 md:mb-10" data-aos="fade-up">
            <div className="relative text-center">
              <div>
                <div>
                  <SectionName><TranslatedText>Actualites et blogs</TranslatedText></SectionName>
                </div>
              </div>
              <HeadingPrimary>
                  <TranslatedText>Dernieres actualites et blog</TranslatedText>
              </HeadingPrimary>
            </div>
          </div>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor mx-auto"></div>
            <p className="mt-4 text-contentColor dark:text-contentColor-dark">Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section>
        <div className="container py-100px">
          <div className="mb-5 md:mb-10" data-aos="fade-up">
            <div className="relative text-center">
              <div>
                <div>
                  <SectionName><TranslatedText>Actualites et blogs</TranslatedText></SectionName>
                </div>
              </div>
              <HeadingPrimary>
                  <TranslatedText>Dernieres actualites et blog</TranslatedText>
              </HeadingPrimary>
            </div>
          </div>
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container py-100px">
        {/*  heading  */}
        <div className="mb-5 md:mb-10" data-aos="fade-up">
          <div className="relative text-center">
            <div>
              <div>
                <SectionName><TranslatedText>Actualites et blogs</TranslatedText></SectionName>
              </div>
            </div>
            <HeadingPrimary>
                <TranslatedText>Dernieres actualites et blog</TranslatedText>
            </HeadingPrimary>
          </div>
        </div>

        {/*  blogs  */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
            {blogs.map((blog, idx) => {
  console.log(blog);
              const { date, month } = formatDate(blog.publishedAt || blog.createdAt);
              
              return idx === 0 ? (
                <div
                  key={blog._id}
                  className="lg:col-start-1 lg:col-span-8 group shadow-blog"
                  data-aos="fade-up"
                >
                  {/*  blog thumbnail  */}
                  <div className="overflow-hidden relative">
                    <Image
                      src={blog.featuredImage 
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${blog.featuredImage}` 
                        : '/placeholder-blog.jpg'}
                      alt={blog.title}
                      className="w-full group-hover:scale-110 transition-all duration-300"
                      width={200}
                      height={200}
                    />
                    <div className="text-base md:text-3xl leading-5 md:leading-9 font-semibold text-white px-15px py-5px md:px-6 md:py-2 bg-primaryColor rounded text-center absolute top-5 left-5">
                      {date} <br /> {month}
                    </div>
                  </div>
                  {/*  blog content  */}
                  <div className="p-5 md:p-35px md:pt-10">
                    <h3 className="text-2xl md:text-4xl leading-30px md:leading-45px font-bold text-blackColor hover:text-primaryColor pb-25px dark:text-blackColor-dark dark:hover:text-primaryColor">
                      <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-base text-contentColor dark:text-contentColor-dark mb-30px">
                      {blog.excerpt || blog.content?.substring(0, 200) + '...'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                          <Image
                            src={blog.author?.profile 
                              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${blog.author.profile}` 
                              : '/placeholder-user.jpg'}
                            alt={`${blog.author?.firstName} ${blog.author?.lastName}`}
                            className="rounded-full"
                            width={44}
                            height={44}
                          />
                        </div>
                        <div className="text-sm md:text-lg text-darkdeep5 dark:text-darkdeep5-dark">
                          <TranslatedText>
                          Par:
                          </TranslatedText>
                          <span className="text-blackColor dark:text-blackColor-dark">
                            {` ${blog.author?.firstName} ${blog.author?.lastName}`}
                          </span>
                        </div>
                      </div>
                      {/*  social  */}
                      <div>
                        <ul className="flex gap-1">
                          <li>
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blog.slug}`)}`}
                              className="text-sm md:text-size-15 w-5 h-5 md:w-[39px] md:h-[39px] flex items-center justify-center border border-borderColor text-darkdeep4 hover:text-primaryColor dark:border-borderColor-dark rounded"
                            >
                              <i className="icofont-facebook"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              href={`https://www.youtube.com/share?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blog.slug}`)}`}
                              className="text-sm md:text-size-15 w-5 h-5 md:w-[39px] md:h-[39px] flex items-center justify-center border border-borderColor text-darkdeep4 hover:text-primaryColor dark:border-borderColor-dark rounded"
                            >
                              <i className="icofont-youtube-play"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blog.slug}`)}`}
                              className="text-sm md:text-size-15 w-5 h-5 md:w-[39px] md:h-[39px] flex items-center justify-center border border-borderColor text-darkdeep4 hover:text-primaryColor dark:border-borderColor-dark rounded"
                            >
                              <i className="icofont-instagram"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              href={`https://www.instagram.com/share?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blog.slug}`)}`}
                              className="text-sm md:text-size-15 w-5 h-5 md:w-[39px] md:h-[39px] flex items-center justify-center border border-borderColor text-darkdeep4 hover:text-primaryColor dark:border-borderColor-dark rounded"
                            >
                              <i className="icofont-twitter"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null;
            })}

            {/*  blog 2 & 3  */}
            <div className="lg:col-start-9 lg:col-span-4">
              <div className="flex flex-col gap-y-30px">
                {blogs.map((blog, idx) => {
                  const { date, month } = formatDate(blog.publishedAt || blog.createdAt);
                  
                  return idx > 0 && idx < 3 ? (
                    <div
                      key={blog._id}
                      className="group shadow-blog"
                      data-aos="fade-up"
                    >
                      {/*  blog thumbnail  */}
                      <div className="overflow-hidden relative">
                        <Image
                          src={blog.featuredImage 
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${blog.featuredImage}` 
                            : '/placeholder-blog.jpg'}
                          alt={blog.title}
                          className="w-full group-hover:scale-110 transition-all duration-300"
                          width={400}
                          height={250}
                        />
                        <div className="text-base md:text-2xl leading-5 md:leading-30px font-semibold text-white px-15px py-5px md:px-22px md:py-7px bg-primaryColor rounded text-center absolute top-5 left-5">
                          {date} <br />
                          {month}
                        </div>
                      </div>
                      {/*  blog content  */}
                      <div className="px-5 py-25px">
                        <h3 className="text-2xl md:text-size-28 leading-30px md:leading-35px font-bold text-blackColor hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor">
                          <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                        </h3>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-contentColor dark:text-contentColor-dark">No blogs available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;