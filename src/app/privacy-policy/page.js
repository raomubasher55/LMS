import PrivacyPolicyMain from "@/components/layout/main/PrivacyPolicyMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Privacy Policy | Tanga Academy – Empowering Digital Education",
  description:
    "Read Tanga Academy's Privacy Policy to understand how we protect your personal data and ensure your privacy while delivering quality digital education.",
};

const PrivacyPolicy = async () => {
  return (
    <PageWrapper>
      <main>
        <PrivacyPolicyMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default PrivacyPolicy;
