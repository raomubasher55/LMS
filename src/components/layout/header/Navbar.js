"use client";
import { usePathname } from "next/navigation";
import NavItems from "./NavItems";
import NavbarLogo from "./NavbarLogo";
import NavbarRight from "./NavbarRight";
import NavItems2 from "./NavItems2";
import useIsTrue from "@/hooks/useIsTrue";

const Navbar = () => {
  const isHome1Dark = useIsTrue("/home-1-dark");

  return (
    <div
      className={`transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark`}
    >
      <nav>
        <div
          className={`py-15px lg:py-0 px-15px ${
            isHome1Dark
              ? "lg:container 3xl:container2-lg"
              : "lg:container 3xl:container-secondary-lg"
          } 4xl:container mx-auto relative`}
        >
          <div className="grid grid-cols-2 lg:grid-cols-12 items-center gap-15px">
            {/* navbar left */}
            <NavbarLogo />
            {/* Main menu */}
             <NavItems />

            {/* navbar right */}
            <NavbarRight isHome2Dark={isHome1Dark} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar
