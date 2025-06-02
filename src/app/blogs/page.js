import BlogsMain from "@/components/layout/main/BlogsMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
title: "Blog | Tanga Academy - Online Courses by Instructors",
description: "Explore the latest updates, tips, and success stories from Tanga Academy — a platform where instructors sell courses and students buy knowledge."
};

const Blogs = async () => {
  return (
    <PageWrapper>
      <main>
        <BlogsMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Blogs;
