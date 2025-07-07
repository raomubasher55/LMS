import AdminWithdrawalsMain from "@/components/layout/main/dashboards/AdminWithdrawalsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Withdrawal Management | Tanga Academie - Online Learning Platform",
  description: "Manage instructor withdrawal requests securely and efficiently through the Tanga Academie admin panel.",
};


const AdminWithdrawals = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminWithdrawalsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default AdminWithdrawals;