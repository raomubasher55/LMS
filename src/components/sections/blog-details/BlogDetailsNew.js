"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogsSidebar from "@/components/shared/blogs/BlogsSidebar";
import RelatedBlogs from "@/components/shared/blog-details/RelatedBlogs";

const BlogDetailsNew = ({ blog }) => {
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatContent = (content) => {
    // Basic HTML rendering - in a real app, you might want to use a markdown parser or sanitize HTML
    return { __html: content };
  };

  useEffect(() => {
     setCurrentUrl(window.location.href);
    const fetchRelatedBlogs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blog.category}/related`
        );
        if (response.ok) {
          const data = await response.json();
          setRelatedBlogs(data.blogs);
        }
      } catch (error) {
        console.error("Error fetching related blogs:", error);
      }
    };

    if (blog.slug) {
      fetchRelatedBlogs();
    }
  }, [blog.slug]);


  
  const handleSocialShare = (platform) => {
    const shareUrl = `${window.location.origin}/blogs/${blog.slug}`;
    const title = encodeURIComponent(blog.title);
    const text = encodeURIComponent(blog.excerpt || blog.title);

        switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}&summary=${text}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text}%20${shareUrl}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${shareUrl}&text=${text}`, '_blank');
        break;
      default:
                break;
    }
  };


  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/blog/${blog.slug}`)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  return (
    <section>
      <div className="container py-10 md:py-50px lg:py-60px 2xl:py-100px">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
          <div className="lg:col-start-1 lg:col-span-8 space-y-[35px]">
            {/* Blog Article */}
            <article data-aos="fade-up">
              {/* Featured Image */}
              {blog.featuredImage && (
                <div className="overflow-hidden relative mb-30px">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${blog.featuredImage}`}
                    alt={blog.title}
                    width={800}
                    height={400}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Blog Meta */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-4 text-sm text-contentColor dark:text-contentColor-dark">
                  <div className="flex items-center">
                    <i className="icofont-calendar mr-2"></i>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="icofont-business-man-alt-2 mr-2"></i>
                    <span>
                      By{" "}
                      {blog.author?.firstName + " " + blog.author.lastName ||
                        "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="icofont-eye mr-2"></i>
                    <span>{blog.views || 0} Views</span>
                  </div>
                  {blog.category && (
                    <div>
                      <span className="px-3 py-1 bg-primaryColor/10 text-primaryColor text-xs font-medium rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Blog Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blackColor dark:text-blackColor-dark mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Blog Excerpt */}
              {blog.excerpt && (
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8 border-l-4 border-primaryColor">
                  <p className="text-lg text-darkdeep4 italic leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              )}

              {/* Blog Content */}
              <div className="max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                <div dangerouslySetInnerHTML={formatContent(blog.content)} />
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-borderColor dark:border-borderColor-dark">
                  <h4 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-4">
                    Tags:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-primaryColor/10 hover:text-primaryColor transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}


              {/* Social Share */}
    {/* Social Share */}
              <div className="mt-8 pt-6 border-t border-borderColor dark:border-borderColor-dark">
                <h4 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-4">
                  Share this post:
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleSocialShare('facebook')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="icofont-facebook mr-2"></i>Facebook
                  </button>
                  <button 
                    onClick={() => handleSocialShare('twitter')}
                    className="flex items-center px-4 py-2 bg-blue-400 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    <i className="icofont-twitter mr-2"></i>Twitter
                  </button>
                  <button 
                    onClick={() => handleSocialShare('linkedin')}
                    className="flex items-center px-4 py-2 bg-blue-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <i className="icofont-linkedin mr-2"></i>LinkedIn
                  </button>
                  <button 
                    onClick={() => handleSocialShare('whatsapp')}
                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    <i className="icofont-whatsapp mr-2"></i>WhatsApp
                  </button>
                  <button 
                    onClick={() => handleSocialShare('telegram')}
                    className="flex items-center px-4 py-2 bg-blue-500 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <i className="icofont-telegram mr-2"></i>Telegram
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <i className="icofont-copy mr-2"></i>Copy Link
                  </button>
                </div>
              </div>
            </article>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div className="mt-12">
                <RelatedBlogs blogs={relatedBlogs} />
              </div>
            )}

            {/* Comments Section (if enabled) */}
            {/* {blog.isCommentEnabled && (
              <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-2xl font-semibold text-blackColor dark:text-blackColor-dark mb-6">
                  Comments
                </h3>
                <p className="text-contentColor dark:text-contentColor-dark">
                  Comments functionality can be integrated here with your
                  preferred commenting system (Disqus, custom comments, etc.)
                </p>
              </div>
            )} */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-start-9 lg:col-span-4">
            <BlogsSidebar blog={blog} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsNew;
