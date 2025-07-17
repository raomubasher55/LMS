import ContactMain from "@/components/layout/main/ContactMain";

import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Contact | Tanga Academie - Online Learning Platform",
  description:
    "Get in touch with Tanga Academie — a dynamic online learning platform where students learn new skills, instructors create and sell courses, and admins manage educational content efficiently.",
};

const Contact = async () => {
  return (
    <PageWrapper>
      <main>
        <ContactMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Contact;
