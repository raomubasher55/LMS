import StudentAnnouncementsMain from "@/components/layout/main/dashboards/StudentAnnouncementsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Student Announcements | Tanga Academy - Course Updates",
  description: "View all announcements from your instructors and stay updated with your course progress.",
};

const Student_Announcements = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentAnnouncementsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Student_Announcements;