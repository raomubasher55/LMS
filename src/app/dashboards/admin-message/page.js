import AdminMessageMain from "@/components/layout/main/dashboards/AdminMessageMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Message | Tanga Academie - Online Learning Platform",
  description: "View and manage all messages and communications from the admin panel on Tanga Academie. Stay connected with students and instructors.",
};

const Admin_Message = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminMessageMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Admin_Message;
