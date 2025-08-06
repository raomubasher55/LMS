import InstructorQuizApprovalsMain from "@/components/layout/main/dashboards/InstructorQuizApprovalsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Quiz Approvals | Tanga Academy - Instructor Dashboard",
  description: "Manage student quiz approval requests and grant permissions for quiz retakes.",
};

const InstructorQuizApprovals = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorQuizApprovalsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default InstructorQuizApprovals;