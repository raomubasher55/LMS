import BecomAnInstructorMain from "@/components/layout/main/BecomAnInstructorMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Become an Instructor | Tanga Academy – Inspire, Teach & Earn",
  description:
    "Share your expertise with thousands of eager learners by becoming an instructor at Tanga Academy. Create and sell impactful courses, empower students across Africa and beyond, and earn on your own schedule.",
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
