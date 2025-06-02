import CreateCourseMain from "@/components/layout/main/CreateCourseMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Create Course | TangaAcademy - Online Learning Platform",
  description: "Create and publish your own course on TangaAcademy, the premier platform for online education and skill development.",
};
const Create_Course = () => {
  return (
    <PageWrapper>
      <main>
        <CreateCourseMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Create_Course;
