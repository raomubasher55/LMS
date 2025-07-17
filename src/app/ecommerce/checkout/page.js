import CheckoutMain from "@/components/layout/main/ecommerce/CheckoutMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Checkout | Tanga Academie - Online Learning Platform",
  description: "Complete your course purchase securely on Tanga Academie and start your learning journey right away.",
};


const Checkout = async () => {
  return (
    <PageWrapper>
      <main>
        <CheckoutMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Checkout;
