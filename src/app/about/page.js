import AboutMain from "@/components/layout/main/AboutMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "About | Tanga Academy – Empowering Digital Education",
  description:
    "Discover Tanga Academy's mission, vision, and educational philosophy. We are committed to advancing digital learning through expert-led programs in technology, design, and innovation.",
};


const About = async () => {
  return (
    <PageWrapper>
      <main>
        <AboutMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default About;
