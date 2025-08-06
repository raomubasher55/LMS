import BlogsPrimaryNew from "@/components/sections/blogs/BlogsPrimaryNew";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import React from "react";

const BlogsMain = () => {
  return (
    <>
      <HeroPrimary title={"Notre Blog"} path={"Blog"} />
      <BlogsPrimaryNew />
    </>
  );
};

export default BlogsMain;
