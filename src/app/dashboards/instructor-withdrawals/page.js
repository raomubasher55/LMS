import InstructorWithdrawalsMain from "@/components/layout/main/dashboards/InstructorWithdrawalsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Payment Withdrawals | Edurock - Education LMS Template",
  description: "Manage Payment Withdrawals | Edurock - Education LMS Template",
};

const InstructorWithdrawals = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorWithdrawalsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default InstructorWithdrawals;