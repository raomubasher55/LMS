"use client"

import Image from "next/image";
import React from "react";
import post1 from "@/assets/images/footer/footer__1.png";
import post2 from "@/assets/images/footer/footer__2.png";
import post3 from "@/assets/images/footer/footer__3.png";
import FooterHeading from "@/components/shared/headings/FooterHeading";
import FooterRecentPost from "./FooterRecentPost";
import TranslatedText from "@/components/shared/TranslatedText";
const FooterRecentPosts = ( {courses} ) => {

  return (
    <div
      className="sm:col-start-1 sm:col-span-12 md:col-start-7 md:col-span-6 lg:col-start-10 lg:col-span-3 pl-0 2xl:pl-50px"
      data-aos="fade-up"
    >
      <FooterHeading className="text-size-22 font-bold mb-3">
        <TranslatedText>Articles recents</TranslatedText>
      </FooterHeading>
      <ul className="flex flex-col gap-y-5">
        {courses.slice(0,4).map((course, idx) => (
          <FooterRecentPost key={idx} course={course} />
        ))}
      </ul>
    </div>
  );
};

export default FooterRecentPosts;
