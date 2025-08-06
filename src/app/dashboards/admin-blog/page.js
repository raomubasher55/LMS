import AdminBlogMain from "@/components/layout/main/dashboards/AdminBlogMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Blog Management | Tanga Academie - Online Learning Platform",
  description: "Manage blog posts and educational content on Tanga Academie. Create, edit, and publish articles to engage and inform learners.",
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