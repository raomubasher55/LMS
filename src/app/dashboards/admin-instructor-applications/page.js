import AdminInstructorApplications from "@/components/layout/main/dashboards/AdminInstructorApplications";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Applications | Tanga Academy LMS",
  description:
    "Review and manage instructor registration applications in the Tanga Academy LMS Admin Dashboard.",
};

const instructors_Applications = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminInstructorApplications />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default instructors_Applications;
