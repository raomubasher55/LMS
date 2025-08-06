import InstructorWithdrawalsMain from "@/components/layout/main/dashboards/InstructorWithdrawalsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Payment Withdrawals | Tanga Academie - Online Learning Platform",
  description: "Manage and track your payment withdrawals securely as an instructor on Tanga Academie.",
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