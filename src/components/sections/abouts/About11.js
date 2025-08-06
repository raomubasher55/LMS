import Image from "next/image";

import aboutImage8 from "@/assets/images/about/about_8.png";
import aboutImage14 from "@/assets/images/about/art.png";
import aboutImage15 from "@/assets/images/about/about_15.png";
import SectionName from "@/components/shared/section-names/SectionName";

import HeadingSecondary from "@/components/shared/headings/HeadingSecondary";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";
import TranslatedText from "@/components/shared/TranslatedText";

const About11 = () => {
  return (
    <section>
      <div className="container py-50px md:py-70px lg:py-20 2xl:py-100px">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-30px">
          {/* about left */}
          <div data-aos="fade-up">
            <TiltWrapper>
              <div className="tilt relative overflow-hidden z-0">
                <Image
                  className="absolute left-0 top-0 lg:top-4 right-0 mx-auto -z-1"
                  src={aboutImage8}
                  alt="Tanga Academie Learning"
                />
                <Image className="w-full" src={aboutImage14} alt="Tanga Academie Students" />
              </div>
            </TiltWrapper>
          </div>
          {/* about right */}
          <div data-aos="fade-up" className="2xl:ml-65px">
            <SectionName><TranslatedText>À propos de nous</TranslatedText></SectionName>
            <HeadingSecondary>
              <TranslatedText>
                Bienvenue à Tanga Academie — Votre centre d'apprentissage en ligne
              </TranslatedText>
            </HeadingSecondary>
            <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-25px">
              <TranslatedText>
                Tanga Academie est une plateforme d'apprentissage en ligne dynamique où des instructeurs experts vendent des cours et où les étudiants découvrent, s’inscrivent et maîtrisent de nouvelles compétences. Notre mission est de promouvoir l’apprentissage tout au long de la vie grâce à une éducation accessible et de haute qualité.
              </TranslatedText>
            </p>
            <p className="flex items-center gap-x-4 text-lg text-blackColor dark:text-blackColor-dark mb-25px">
              <Image loading="lazy" src={aboutImage15} alt="Experience Icon" />
              <span>
                <TranslatedText>
                  <b>Fiable pour plus de 5000 étudiants et instructeurs</b> dans le monde entier, offrant une éducation de qualité et favorisant la croissance.
                </TranslatedText>
              </span>
            </p>
            <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark">
            <TranslatedText>
              Que vous soyez un instructeur souhaitant partager votre expertise ou un étudiant désireux d’apprendre, Tanga Academie offre une expérience fluide pour créer, gérer et accéder aux cours à tout moment et en tout lieu. Rejoignez-nous dès aujourd’hui et faites partie d’une communauté d’apprentissage dynamique !

            </TranslatedText>
            </p>

            <div className="mt-30px">
              <ButtonPrimary path="/about" arrow={true}>
                <TranslatedText>En savoir plus</TranslatedText>
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About11;
