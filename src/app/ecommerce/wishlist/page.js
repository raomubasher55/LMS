import WishlistMain from "@/components/layout/main/ecommerce/WishlistMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Wishlist | Tanga Academie - Online Learning Platform",
  description: "View and manage your saved courses on Tanga Academie. Easily keep track of courses you want to enroll in later.",
};


const Wishlist = async () => {
  return (
    <PageWrapper>
      <main>
        <WishlistMain />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Wishlist;
