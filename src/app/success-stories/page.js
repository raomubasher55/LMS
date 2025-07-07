import SuccessStoryMain from "@/components/layout/main/SuccessStoryMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Success Stories | Tanga Academy – Empowering Digital Education",
  description:
    "Explore inspiring success stories from Tanga Academy students who have transformed their careers through our expert-led digital education programs in web development, design, and technology.",
};


const SuccessStory = async () => {
  return (
    <PageWrapper>
      <main>
        <SuccessStoryMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default SuccessStory;
