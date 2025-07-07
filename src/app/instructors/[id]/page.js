import InstructorDetailsMain from "@/components/layout/main/InstructorDetailsMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
title: "Instructor Details | Tanga Academy - Online Learning Platform",
description: "Instructor Details | Tanga Academy - Explore expert-led courses and grow your skills with our leading online education platform.",
};
const Instructor_Details = ({ params }) => {
  const { id } = params;

  return (
    <PageWrapper>
      <main>
        <InstructorDetailsMain id={id} />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Instructor_Details;
