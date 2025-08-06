import LoginMain from "@/components/layout/main/LoginMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Login/Register | Tanga Academie - Online Learning Platform",
  description: "Login or create your account on Tanga Academie to start learning, teaching, or managing courses easily and securely.",
};

const Login = () => {
  return (
    <PageWrapper>
      <main>
        <LoginMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Login;
