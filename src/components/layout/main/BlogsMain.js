import BlogsPrimaryNew from "@/components/sections/blogs/BlogsPrimaryNew";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import React from "react";

const BlogsMain = () => {
  return (
    <>
      <HeroPrimary title={"Our Blog"} path={"Blog"} />
      <BlogsPrimaryNew />
    </>
  );
};

export default BlogsMain;
