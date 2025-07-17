import LessonCourseMaterialsMain from "@/components/layout/main/LessonCourseMaterialsMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Lesson Course Materials | Tanga Academie - Online Learning Platform",
  description: "Access downloadable resources and course materials for your lessons on Tanga Academie to support your learning journey.",
};

const Lesson_Course_Materials = () => {
  return (
    <PageWrapper>
      <main>
        <LessonCourseMaterialsMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Lesson_Course_Materials;
