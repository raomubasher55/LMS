import InstructorSettingsMain from "@/components/layout/main/dashboards/InstructorSettingsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Setting | Tanga Academie - Online Learning Platform",
  description: "Manage your instructor profile, preferences, and course settings on Tanga Academie to enhance your teaching experience.",
};

const Instructor_Setting = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorSettingsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Instructor_Setting;
