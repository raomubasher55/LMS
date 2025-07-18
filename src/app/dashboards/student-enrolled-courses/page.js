import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import StudentEnrolledCoursesMain from "@/components/layout/main/dashboards/StudentEnrolledCoursesMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Enrolled Courses | Tanga Academie - Online Learning Platform",
  description: "Access and manage all the courses you’re enrolled in as a student on Tanga Academie. Continue learning anytime, anywhere.",
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
