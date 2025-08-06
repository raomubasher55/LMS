import Services from "@/components/layout/main/Services";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Our Services | Tanga Academie – Empowering Digital Education",
  description:
    "Discover the range of services offered by Tanga Academie — from course creation tools to publishing and selling support, we empower instructors to succeed in digital education.",
};

const PrivacyPolicy = async () => {
  return (
    <PageWrapper>
      <main>
        <Services />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default PrivacyPolicy;
