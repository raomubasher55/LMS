"use client";
import FooterNavList from "./FooterNavList";
import CopyRight from "./CopyRight";
import FooterTop from "./FooterTop";

const Footer = () => {
  return (
    <footer
      className={`dark:bg-darkblack bg-white 2xl:bg-cover`}
    >
      <div
        className={`container pt-65px pb-5 lg:pb-10 `}
      >
        {/* footer top or subscription */}
        <FooterTop />
        {/* footer main */}
        <FooterNavList />

        {/* footer copyright  */}
        <CopyRight />
      </div>
    </footer>
  );
};

export default Footer;
