import StudentOrderHistoryMain from "@/components/layout/main/dashboards/StudentOrderHistoryMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Order History | Tanga Academy - Learn from Top Instructors",
  description: "View your purchase history for Tanga Academy, a premium LMS platform where students can purchase paid courses and learn directly from expert instructors.",
};

const Student_Order_History = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentOrderHistoryMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Student_Order_History;