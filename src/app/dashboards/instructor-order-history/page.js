import InstructorOrderHistoryMain from "@/components/layout/main/dashboards/InstructorOrderHistoryMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Order History | Tanga Academy - Track Your Course Sales",
  description: "Review all your course sales, payments, and order details on Tanga Academy. Stay on top of your earnings and manage your sales history efficiently.",
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
