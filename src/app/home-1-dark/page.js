import Home1 from "@/components/layout/main/Home1";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const metadata = {
  title: "Home | Tanga - Academy ",
};
const Home1Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <ThemeController />
        <ToastContainer />
        <Home1 />
      </main>
    </PageWrapper>
  );
};

export default Home1Dark;
