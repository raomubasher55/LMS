import AdminUserMain from "@/components/layout/main/dashboards/AdminUserMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
    title: "Users Management | Tanga Academy LMS",
    description: "Manage and view all users and instructors in the Tanga Academy LMS Admin Dashboard.",
};
const User_Management = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminUserMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default User_Management;
