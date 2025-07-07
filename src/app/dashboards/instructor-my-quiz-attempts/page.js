import InstructorMyQuizAttemptsMain from "@/components/layout/main/dashboards/InstructorMyQuizAttemptsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor My Quiz Attempts | Tanga Academie - Online Learning Platform",
  description: "Track and review quiz attempts made by your students on Tanga Academie. Analyze performance and provide feedback effectively.",
};

const Instructor_My_Quiz_Attempts = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorMyQuizAttemptsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Instructor_My_Quiz_Attempts;
