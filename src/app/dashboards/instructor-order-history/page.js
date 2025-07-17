import InstructorOrderHistoryMain from "@/components/layout/main/dashboards/InstructorOrderHistoryMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Order History | Tanga Academie - Online Learning Platform",
  description: "View and manage your course sales and transaction history as an instructor on Tanga Academie.",
};

const Instructor_Order_History = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorOrderHistoryMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Instructor_Order_History;
