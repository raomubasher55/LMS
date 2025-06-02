import CourseDetailsMain from "@/components/layout/main/CourseDetailsMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Course Details | Edurock - Education LMS Template",
  description: "Course Details | Edurock - Education LMS Template",
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
