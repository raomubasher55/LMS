import NewsletterDashboard from "@/components/layout/main/dashboards/NewsletterDashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
title: "Newsletter Subscriber Management | Tanga Academy - Online Course Platform",
description: "Manage newsletter subscribers and email lists on Tanga Academy, the platform for buying and selling online courses.",
};

const AdminNewsletterUsbscriber = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <NewsletterDashboard />
          </DashboardContainer>
        </DsahboardWrapper>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default AdminNewsletterUsbscriber;