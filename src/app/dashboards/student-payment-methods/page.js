import StudentPaymentMethodsMain from "@/components/layout/main/dashboards/StudentPaymentMethodsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Payment Methods | Tanga Academy - Learn from Top Instructors",
  description: "Manage your payment methods for Tanga Academy, a premium LMS platform where students can purchase paid courses and learn directly from expert instructors.",
};

const Student_Payment_Methods = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentPaymentMethodsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Student_Payment_Methods;