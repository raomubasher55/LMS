import StudentMessageMain from "@/components/layout/main/dashboards/StudentMessageMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Messages | Tanga Academy - Communicate with Your Instructors",
  description: "Send and receive messages with your instructors on Tanga Academy. Stay connected, ask questions, and get support throughout your learning journey.",
};

const Student_Message = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentMessageMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Student_Message;
