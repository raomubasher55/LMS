import Image from "next/image";
import React from "react";
import logo1 from "@/assets/images/logo/tanga.jpeg";
import Link from "next/link";
const NavbarLogo = () => {
  return (
    <div className="lg:col-start-1 lg:col-span-2 rounded-2xl overflow-hidden">
      <Link href="/" className="w-logo-sm lg:w-logo-lg rounded-2xl overflow-hidden">
        <Image priority={false} src={logo1} alt="logo" className="w-full py-2 rounded-2xl overflow-hidden" />
      </Link>
    </div>
  );
};

export default NavbarLogo;
