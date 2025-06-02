import CheckoutMain from "@/components/layout/main/ecommerce/CheckoutMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Checkout | Tanga Academy - Learn and Grow",
  description: "Complete your enrollment at Tanga Academy. Secure and fast checkout for your selected courses.",
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
