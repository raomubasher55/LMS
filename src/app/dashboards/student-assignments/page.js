import StudentAssignmentsMain from "@/components/layout/main/dashboards/StudentAssignmentsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Assignments | Tanga Academie - Online Learning Platform",
  description: "View, submit, and track your course assignments as a student on Tanga Academie. Enhance your learning through practical tasks.",
};

const Student_Assignments = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentAssignmentsMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Student_Assignments;
