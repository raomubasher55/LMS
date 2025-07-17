"use client";
import SectionName from "@/components/shared/section-names/SectionName";
import Image from "next/image";
import React from "react";
import Counter from "../sub-section/Counter";
import about2 from "@/assets/images/about/art.png";
import about3 from "@/assets/images/about/about_3.png";
import about4 from "@/assets/images/about/about_4.png";
import about11 from "@/assets/images/about/about_11.png";
import about19 from "@/assets/images/about/about_19.png";
import counter1 from "@/assets/images/counter/counter__1.png";
import counter2 from "@/assets/images/counter/counter__2.png";
import counter3 from "@/assets/images/counter/counter__3.png";
import counter4 from "@/assets/images/counter/counter__4.png";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";
import TranslatedText from "@/components/shared/TranslatedText";
import useIsTrue from "@/hooks/useIsTrue";
const About1 = ({ children, image, hideCounter }) => {
  const isHome9 = useIsTrue("/home-9");
  const isHome9Dark = useIsTrue("/home-9-dark");
  const counterItems = [
    {
      name: <TranslatedText>Réussite totale</TranslatedText>,
      image: counter1,
      data: 27,
      symbol: "+",
    },
    {
      name: <TranslatedText>Étudiants satisfaits</TranslatedText>,
      image: counter2,
      data: 145,
      symbol: "+",
    },
    {
      name: <TranslatedText>Instructeurs</TranslatedText>,
      image: counter3,
      data: 10,
      symbol: "k",
    },
    {
      name: <TranslatedText>Dans le monde entier</TranslatedText>,
      image: counter4,
      data: 214,
      symbol: "+",
    },
  ];
  return (
    <section>
      <div className={`container ${hideCounter ? "pt-70px pb-100px" : ""}`}>
        {/* about section   */}
        <div className="grid grid-cols-1 lg:grid-cols-2 pt-30px gap-x-30px">
          {/* about left  */}
          <div
            className="relative z-0 mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 overflow-visible"
            data-aos="fade-up"
          >
            <TiltWrapper>
              <div className="tilt">
                <Image
                  className="md:ml-[0px]"
                  src={image ? image : about2}
                  alt=""
                />
                {/* <Image
                  className="absolute right-0 sm:right-[-17px] md:right-36 lg:right-4 bottom-[91px] md:bottom-0"
                  src={isHome9 || isHome9Dark ? about19 : about3}
                  alt=""
                /> */}
                <Image
                  className="absolute top-[-18px] left-[30px] animate-move-hor z-[-1]"
                  src={about4}
                  alt=""
                />
                <Image
                  className="absolute top-[30%] left-0 z-[-1]"
                  src={about11}
                  alt=""
                />
              </div>
            </TiltWrapper>
            {/* experience  */}
            <div className="px-10px py-3 md:py-25px border-l-4 border-primaryColor shadow-experience absolute bottom-0 left-0 bg-white dark:bg-whiteColor-dark animate-move-var w-[290px]">
              <div className="counter flex items-center">
                <p className="text-[40px] text-primaryColor font-bold uppercase pr-10px leading-1">
                  <span data-countup-number="25">25</span>+
                </p>
                <p className="text-blackColor dark:text-blackColor-dark font-bold leading-26px">
                 <TranslatedText>
                  ANNÉES D'EXPÉRIENCE RÉCEMMENT ACQUISES
                 </TranslatedText>
                </p>
              </div>
            </div>
          </div>
          {/* about right  */}
          <div data-aos="fade-up">
            <SectionName>
              <TranslatedText>
                À propos de nous
              </TranslatedText>
            </SectionName>
            <h3 className="text-3xl md:text-size-45 leading-10 md:leading-2xl font-bold text-blackColor dark:text-blackColor-dark pb-25px">
              {children ? (
                children
              ) : (
                <>
                  <TranslatedText>
                    Bienvenue à
                  </TranslatedText>
                  {" "}
                  <span className="relative after:w-full after:h-[7px] after:bg-secondaryColor after:absolute after:left-0 after:bottom-3 md:after:bottom-5">
                    Tanga Academie
                  </span>{" "}
                  –
                  <TranslatedText>
                    votre destination d’apprentissage ultime
                  </TranslatedText>
                </>
              )}
            </h3>
            <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-6 pl-3 border-l-2 border-primaryColor">
              <TranslatedText>
                Tanga Academie est une plateforme d’apprentissage en ligne complète où les instructeurs peuvent facilement
                télécharger et vendre leurs cours, et les étudiants peuvent accéder à du contenu de haute qualité via des vidéos,
                des PDF, des quiz et des devoirs — le tout en un seul endroit.
              </TranslatedText>

            </p>
            <ul className="space-y-[14px]">
              <li className="flex items-center group">
                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                  <TranslatedText>
                    Apprenez grâce à des vidéos, des PDF téléchargeables, des quiz et des devoirs
                  </TranslatedText>
                </p>
              </li>
              <li className="flex items-center group">
                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                  <TranslatedText>
                    Les instructeurs peuvent monétiser leurs compétences en téléchargeant et en vendant leurs cours.
                  </TranslatedText>
                </p>
              </li>
              <li className="flex items-center group">
                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                  <TranslatedText>
                    Une expérience LMS complète avec suivi de progression et contenu interactif.
                  </TranslatedText>

                </p>
              </li>
            </ul>
          </div>
        </div>
        {/* about counter  */}
        {isHome9 || isHome9Dark || hideCounter || (
          <Counter items={counterItems} />
        )}
      </div>
    </section>
  );
};

export default About1;
