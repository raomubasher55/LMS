import CoursesMain from "@/components/layout/main/CoursesMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
title: "Courses | Tanga Academy - Online Learning Platform",
description: "Browse a wide range of courses on Tanga Academy, your trusted online learning platform for skill development and education.",
};

const Courses = async () => {
  return (
    <PageWrapper>
      <main>
        <CoursesMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Courses;
