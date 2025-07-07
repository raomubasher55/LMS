import InstructorAnnoucementsMain from "@/components/layout/main/dashboards/InstructorAnnoucementsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Announcements | Tanga Academie - Online Learning Platform",
  description: "Create and manage course announcements to keep your students informed and engaged on Tanga Academie.",
};

const Instructor_Announcements = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorAnnoucementsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Instructor_Announcements;
