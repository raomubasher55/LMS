import CartMain from "@/components/layout/main/ecommerce/CartMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Courses | Tanga Academy LMS",
  description: "Explore and manage all available courses in the Tanga Academy Learning Management System.",
};

const Cart = async () => {
  return (
    <PageWrapper>
      <main>
        <CartMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Cart;
