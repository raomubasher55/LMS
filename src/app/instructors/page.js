import InstructorMain from "@/components/layout/main/InstructorMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Instructor | Tanga Academy – Learn from Industry Experts",
  description:
    "Meet the instructors at Tanga Academy—dedicated professionals with real-world experience in tech, design, business, and more. Empower your future with expert-led education.",
};

const Instructors = () => {
  return (
    <PageWrapper>
      <main>
        <InstructorMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Instructors;
