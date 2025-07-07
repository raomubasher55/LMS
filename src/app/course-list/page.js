import CourseListMain from "@/components/layout/main/CourseListMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Course List | Tanga Academie - Online Learning Platform",
  description:
    "Browse the full list of available courses on Tanga Academie. Learn from expert instructors and choose the right course to grow your skills.",
};


const Course_List = async () => {
  return (
    <PageWrapper>
      <main>
        <CourseListMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Course_List;
