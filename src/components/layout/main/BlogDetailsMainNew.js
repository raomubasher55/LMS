import BlogDetailsNew from "@/components/sections/blog-details/BlogDetailsNew";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";

const BlogDetailsMainNew = ({ blog }) => {
  return (
    <>
      <HeroPrimary path={"Blog"} title={blog.title} />
      <BlogDetailsNew blog={blog} />
    </>
  );
};

export default BlogDetailsMainNew;