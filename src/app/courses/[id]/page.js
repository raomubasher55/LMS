import CourseDetailsMain from "@/components/layout/main/CourseDetailsMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Course Details | Tanga Academie - Online Learning Platform",
  description:
    "View detailed information about this course on Tanga Academie — including curriculum, instructor info, and what you'll learn. Start your learning journey today.",
};


const Course_Details = async ({ params }) => {
  const { id } = params;

  if (!id) {
    notFound();
  }

  return (
    <PageWrapper>
      <main>
        <CourseDetailsMain id={id} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Course_Details;
