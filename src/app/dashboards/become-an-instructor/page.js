import BecomAnInstructorMain from "@/components/layout/main/BecomAnInstructorMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Become An Instructor | Tanga Academie - Online Learning Platform",
  description: "Join Tanga Academie as an instructor and share your expertise with learners worldwide. Create, manage, and sell your own courses.",
};

const Become_An_Instructor = () => {
  return (
    <PageWrapper>
      <main>
        <BecomAnInstructorMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Become_An_Instructor;
