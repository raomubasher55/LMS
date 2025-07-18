import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import StudentSettingsMain from "@/components/layout/main/dashboards/StudentSettingsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Settings | Tanga Academie - Online Learning Platform",
  description: "Manage your account settings, preferences, and notifications as a student on Tanga Academie.",
};

const Student_Settings = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentSettingsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Student_Settings;
