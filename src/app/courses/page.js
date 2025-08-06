import CoursesMain from "@/components/layout/main/CoursesMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Courses | Tanga Academie - Online Learning Platform",
  description:
    "Discover a wide range of high-quality courses on Tanga Academie. Learn at your own pace from industry experts and grow your knowledge today.",
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
