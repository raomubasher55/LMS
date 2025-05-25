import AdminBlogMain from "@/components/layout/main/dashboards/AdminBlogMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Blog Management | Edurock - Education LMS Template",
  description: "Manage Blog Posts | Edurock - Education LMS Template",
};

const AdminBlog = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminBlogMain />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default AdminBlog;