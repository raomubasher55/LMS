import LoginMain from "@/components/layout/main/LoginMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
title: "Login or Register | Tanga Academy - Online Learning Platform",
description: "Login or create an account to access your personalized Tanga Academy dashboard. Whether you're a student, instructor, or admin, manage your courses and learning easily."
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
