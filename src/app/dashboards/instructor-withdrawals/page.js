import InstructorWithdrawalsMain from "@/components/layout/main/dashboards/InstructorWithdrawalsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Payment Withdrawals | Tanga Academy - Manage Your Earnings",
  description: "Request and track your payment withdrawals securely on Tanga Academy. Monitor your earnings and transaction history with ease.",
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