import InstructorAssignmentsCreate from "@/components/layout/main/dashboards/InstructorAssignmentsCreate";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Create New Assignment | Tanga Academy",
  description: "Build effective student assignments with Tanga Academy's creation tools. Set due dates, grading rubrics, and submission formats."
};
const Instructor_Assignments = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorAssignmentsCreate />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Instructor_Assignments;
