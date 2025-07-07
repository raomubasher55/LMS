import InstructorQuizAnalyticsMain from "@/components/layout/main/dashboards/InstructorQuizAnalyticsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Quiz Analytics | Tanga Academy - Instructor Dashboard",
  description: "Comprehensive quiz analytics and performance insights for your courses.",
};

const InstructorQuizAnalytics = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorQuizAnalyticsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default InstructorQuizAnalytics;