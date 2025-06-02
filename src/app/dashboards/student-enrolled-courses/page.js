import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import StudentEnrolledCoursesMain from "@/components/layout/main/dashboards/StudentEnrolledCoursesMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "My Enrolled Courses | Tanga Academy - Access & Manage Your Learning",
  description: "Browse and manage all the courses you are enrolled in on Tanga Academy. Track progress, continue learning, and explore new opportunities.",
};

const Student_Enrolled_Courses = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentEnrolledCoursesMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Student_Enrolled_Courses;
