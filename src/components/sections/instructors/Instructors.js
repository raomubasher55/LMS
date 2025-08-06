import Image from "next/image";
import React from "react";
import aboutImage5 from "@/assets/images/about/about_5.png";
import aboutImage6 from "@/assets/images/about/about_6.png";
import aboutImage7 from "@/assets/images/about/about_7.png";
import aboutImage9 from "@/assets/images/about/about_9.png";
import SectionName from "@/components/shared/section-names/SectionName";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import TranslatedText from "@/components/shared/TranslatedText";

const Instructors = () => {
  const instructors = [
    {
      name: "Jean-Claude Makufi",
      desig: "Étudiant en mobilité internationale",
      image: aboutImage5,
      desc: "« Le service de traduction a dépassé mes attentes ! Mon dossier de candidature a été traduit avec une précision remarquable. J’ai pu l’utiliser pour une demande de visa et tout a été approuvé sans souci. » ",
    },
    {
      name: "Aminata",
      desig: "Développeuse Web Junior",
      image: aboutImage5,
      desc: "« J’ai utilisé les deux services de Tanga Académie : création de CV et traduction. Le résultat était tout simplement parfait. Mon CV en anglais a été accepté par une entreprise au Canada, et j’ai déjà commencé le processus de recrutement. » ",
    },
  ];

  return (
    <section className="bg-lightGrey10 dark:bg-lightGrey10-dark relative">
      <div>
        <Image
          src={aboutImage6}
          alt=""
          className="absolute top-[110px] left-[216px] animate-move-hor z-1"
        />
        <Image
          src={aboutImage7}
          alt=""
          className="absolute top-[320px] left-[162px] md:left-[262px] lg:left-[318px] 2xl:left-[162px] animate-spin-slow z-1"
        />
        <Image
          src={aboutImage9}
          alt=""
          className="absolute top-[430px] left-[156px] md:top-[630px] md:left-[476px] lg:top-[433px] lg:left-[196px] 2xl:top-[400px] 2xl:left-[156px] animate-move-var z-1"
        />
      </div>
      <div className="container pt-20 pb-20 2xl:pt-30 2xl:pb-90px">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15">
          <div
            className="lg:col-start-1 lg:col-span-1 md:col-start-1 md:col-span-2"
            data-aos="fade-up"
          >
            <div className="relative">
              <SectionName>
                <TranslatedText>
                 Témoignages de clients
                </TranslatedText>
              </SectionName>
              <HeadingPrimary>
                <TranslatedText>
                  Ce que disent nos clients
                </TranslatedText>

              </HeadingPrimary>
              <p className="text-sm md:text-base text-contentColor mt-5 mb-5 2xl:mb-45px dark:text-contentColor-dark">
              <TranslatedText>
               Tanga Academie permet aux instructeurs de partager leurs connaissances avec le monde. De l’informatique et des affaires aux arts et au développement personnel, nos clients apprécient la facilité avec laquelle ils peuvent créer, publier et vendre des cours sur les sujets qui les passionnent
              </TranslatedText>
              </p>

              {/* <div>
                <ButtonPrimary path="/register" color="secondary" arrow={true} href="/register">
                <TranslatedText>

                  Devenez instructeur
                </TranslatedText>
                </ButtonPrimary>
              </div> */}
            </div>
          </div>

          {instructors.map(({ name, image, desc, desig }, idx) => (
            <div key={idx} data-aos="fade-up">
              <div className="bg-whiteColor px-25px py-50px mb-22px relative dark:bg-whiteColor-dark">
                <p className="text-base lg:text-sm 2xl:text-base text-contentColor dark:text-contentColor-dark">
                  {desc}
                </p>

                <div className="text-xl lg:text-3xl text-whiteColor bg-[#2C3340] dark:bg-primaryColor w-10 h-10 lg:w-15 lg:h-15 flex items-center justify-center absolute top-0 left-0 md:-translate-y-1/2 md:-translate-x-1/2 z-20">
                  <i className="icofont-quote-left"></i>
                </div>
                <span className="w-0 h-0 border-l-12 border-r-12 border-t-15 border-l-transparent border-r-transparent border-t-whiteColor absolute bottom-[-14px] left-[27px] dark:border-t-whiteColor-dark"></span>
              </div>

              <div className="flex items-center gap-5 2xl:gap-20">
                <div>
                  <Image
                    src={image}
                    alt={name}
                    className="w-20 h-20 rounded-full"
                    placeholder="blur"
                  />
                </div>
                <div>
                  <h4 className="text-xl lg:text-lg 2xl:text-xl font-semibold text-blackColor dark:text-blackColor-dark">
                    {name}
                  </h4>
                  <p className="text-base lg:text-size-15 2xl:text-base text-lightGrey9 dark:text-lightGrey9-dark">
                    {desig}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instructors;
