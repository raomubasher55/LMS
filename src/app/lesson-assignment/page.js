import LessonAssignmentMain from "@/components/layout/main/LessonAssignmentMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Lesson Assignment | Tanga Academie - Online Learning Platform",
  description: "Access and complete lesson assignments on Tanga Academie to reinforce your understanding and track your progress.",
};

const Lesson_Assignment = () => {
  return (
    <PageWrapper>
      <main>
        <LessonAssignmentMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Lesson_Assignment;
