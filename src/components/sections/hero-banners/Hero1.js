"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import PagragraphHero from "@/components/shared/paragraphs/PagragraphHero";
import HreoName from "@/components/shared/section-names/HreoName";
import TranslatedText from "@/components/shared/TranslatedText";
import Image from "next/image";
import React, { useEffect } from "react";
import about1 from "@/assets/images/about/momo.png";
import about8 from "@/assets/images/about/about_8.png";
import herobanner2 from "@/assets/images/register/register__2.png";
import herobanner6 from "@/assets/images/herobanner/herobanner__6.png";
import herobanner7 from "@/assets/images/herobanner/herobanner__7.png";
import Link from "next/link";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";

const Hero1 = () => {
  return (
    <section data-aos="fade-up">
      {/* banner section  */}
      <div className="container2-xl bg-[#2C3340] dark:bg-darkdeep1 pt-50px md:pt-20 pb-205px md:pb-35 rounded-2xl relative overflow-hidden shadow-brand">
        <div className="container grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* banner Left  */}
          <div data-aos="fade-up">
            <HreoName>
              <TranslatedText>Tanga Academie</TranslatedText>
            </HreoName>
            <HeadingLg color="white">
              <TranslatedText>
                Renforcez votre avenir avec un apprentissage intelligent
              </TranslatedText>
            </HeadingLg>
            <PagragraphHero color="white">
              <TranslatedText>
                Tanga Academie offre un moyen moderne, engageant et flexible d'acquérir des connaissances et de maîtriser de nouvelles compétences. Commencez votre voyage aujourd'hui.
              </TranslatedText>
            </PagragraphHero>

            <div className="mt-30px md:mt-45px">
              <Link
                href="/courses"
                className="text-sm md:text-size-15 font-semibold text-darkdeep2 bg-whiteColor border border-whiteColor px-5 md:px-30px py-3 md:py-4 hover:text-whiteColor hover:bg-darkblack rounded inline-block mr-6px md:mr-30px shadow-hero-action dark:bg-whiteColor-dark dark:hover:bg-whiteColor dark:text-whiteColor dark:hover:text-whiteColor-dark dark:border-none"
              >
                <TranslatedText>Voir les cours</TranslatedText>
              </Link>
              <Link
                href="/courses"
                className="text-sm md:text-size-15 font-semibold text-whiteColor py-3 md:py-4 hover:text-secondaryColor inline-block"
              >
                <TranslatedText>En savoir plus</TranslatedText> <i className="icofont-long-arrow-right"></i>
              </Link>
            </div>
          </div>
          {/* banner right  */}
          <div data-aos="fade-up">
            <TiltWrapper>
              <div className="tilt relative">
                <Image
                  placeholder="blur"
                  className="w-full"
                  src={about8}
                  alt=""
                />
                <Image
                  className="absolute left-0 top-0 lg:top-4 right-0 mx-auto"
                  src={about1}
                  alt=""
                />
              </div>
            </TiltWrapper>
          </div>
        </div>

        <div>
          <Image
            className="absolute left-1/2 bottom-[15%] animate-spin-slow"
            src={herobanner2}
            alt=""
          />
          <Image
            className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
            src={herobanner6}
            alt=""
          />
          <Image
            className="absolute right-[5%] bottom-[15%]"
            src={herobanner7}
            alt=""
          />
          <Image
            className="absolute top-[5%] left-[45%]"
            src={herobanner7}
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default Hero1;
