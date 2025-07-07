import CourseLearnMain from "@/components/layout/main/CourseLearnMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Course Learning | Tanga Academy - Learn from Top Instructors",
  description: "Access your course content and start learning with expert instructors.",
};

const CourseLearn = ({ params }) => {
  const { id } = params;

  return (
    <PageWrapper>
      <main>
        <CourseLearnMain courseId={id} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default CourseLearn;