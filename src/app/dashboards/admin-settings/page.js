import AdminSettingsMain from "@/components/layout/main/dashboards/AdminSettingsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Settings | Tanga Academie - Online Learning Platform",
  description: "Configure and manage platform settings from the Tanga Academie admin panel. Customize features, user roles, and system preferences.",
};

const Admin_Settings = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminSettingsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Admin_Settings;
