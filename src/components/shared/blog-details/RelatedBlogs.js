import Image from "next/image";
import Link from "next/link";

const RelatedBlogs = ({ blogs }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatContent = (content, length = 100) => {
    if (!content) return '';
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return textContent.length > length 
      ? textContent.substring(0, length) + '...' 
      : textContent;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold text-blackColor dark:text-blackColor-dark mb-6">
        Related Posts
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <article key={blog._id} className="bg-white dark:bg-whiteColor-dark rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            <Link href={`/blogs/${blog.slug}`}>
              <div className="aspect-video overflow-hidden">
                {blog.featuredImage ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${blog.featuredImage}`}
                    alt={blog.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <i className="icofont-image text-2xl text-gray-400"></i>
                  </div>
                )}
              </div>
            </Link>

            {/* Content */}
            <div className="p-4">
              {/* Category */}
              {blog.category && (
                <div className="mb-2">
                  <span className="px-2 py-1 bg-primaryColor/10 text-primaryColor text-xs font-medium rounded">
                    {blog.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h4 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-2 line-clamp-2 hover:text-primaryColor transition-colors">
                <Link href={`/blogs/${blog.slug}`}>
                  {blog.title}
                </Link>
              </h4>

              {/* Excerpt */}
              {(blog.excerpt || blog.content) && (
                <p className="text-sm text-contentColor dark:text-contentColor-dark mb-3 line-clamp-2">
                  {blog.excerpt || formatContent(blog.content)}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-contentColor dark:text-contentColor-dark">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <i className="icofont-calendar mr-1"></i>
                    {formatDate(blog.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <i className="icofont-eye mr-1"></i>
                    {blog.views || 0}
                  </span>
                </div>
                <Link 
                  href={`/blogs/${blog.slug}`}
                  className="text-primaryColor hover:text-primaryColor/80 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;