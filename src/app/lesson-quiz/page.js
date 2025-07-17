import LessonQuizMain from "@/components/layout/main/LessonQuizMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Lesson Quiz | Tanga Academie - Online Learning Platform",
  description: "Take quizzes to test your knowledge and reinforce learning after each lesson on Tanga Academie.",
};

const Lesson_Quiz = () => {
  return (
    <PageWrapper>
      <main>
        <LessonQuizMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Lesson_Quiz;
