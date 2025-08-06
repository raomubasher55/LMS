"use client";
import MobileMenuItems from "./MobileItems";
import MobileItems2 from "./MobileItems2";
import MobileMenuSearch from "./MobileMenuSearch";
import MobileMyAccount from "./MobileMyAccount";
import MobileSocial from "./MobileSocial";
import MobileMenuClose from "@/components/shared/buttons/MobileMenuClose";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import useIsTrue from "@/hooks/useIsTrue";

const MobileMenu = () => {
  const isHome2Dart = useIsTrue("/home-2-dark");
  return (
    <div className="mobile-menu w-mobile-menu-sm md:w-mobile-menu-lg fixed top-0 -right-[280px] md:-right-[330px] transition-all duration-500 w-mobile-menu h-full shadow-dropdown-secodary bg-whiteColor dark:bg-whiteColor-dark z-high block lg:hidden">
      <MobileMenuClose />

      {/*  mobile menu wrapper */}
      <div className="px-5 md:px-30px pt-5 md:pt-10 pb-50px h-full overflow-y-auto">
        {/* <MobileMenuSearch /> */}
        
        {/* Mobile Language Switcher */}
        <div className="mb-6 flex justify-center">
          <LanguageSwitcher />
        </div>
        
        <MobileItems2 />
        {/*  my account accordion */}
        <MobileMyAccount />
        {/*  Mobile menu social area */}

        {/* <MobileSocial /> */}
      </div>
    </div>
  );
};

export default MobileMenu;
