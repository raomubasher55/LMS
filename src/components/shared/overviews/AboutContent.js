"use client";
import Image from "next/image";
import overviewImage from "@/assets/images/about/overview.jpg";
import overviewKidImage from "@/assets/images/about/overview_kg.png";
import useIsTrue from "@/hooks/useIsTrue";
import TranslatedText from "../TranslatedText";

const AboutContent = () => {
  const isHome9 = useIsTrue("/home-9");
  const isHome9Dark = useIsTrue("/home-9-dark");
  const isAbout = useIsTrue("/about");
  const isAboutDark = useIsTrue("/about-dark");

  return (
    <div>
      <p className="text-contentColor dark:text-contentColor-dark mb-25px">
        <TranslatedText>
        Tanga Academie est une plateforme d'apprentissage en ligne dynamique qui connecte des instructeurs passionnés avec des apprenants du monde entier. Nous croyons en l'autonomisation des étudiants grâce à des cours accessibles et de haute qualité couvrant un large éventail de compétences et de secteurs.
        </TranslatedText>
      </p>

      {isAbout || isAboutDark ? (
        <>
          <h4 className="text-xl font-medium text-blackColor dark:text-blackColor font-thinor-dark dark:text-blackColor-dark">
           <TranslatedText>
            Cours dirigés par des experts dans divers domaines
           </TranslatedText>
          </h4>
          <p className="text-contentColor dark:text-contentColor-dark mb-25px">
           <TranslatedText>
            Nos instructeurs sont des professionnels du secteur dédiés à fournir un contenu pratique et engageant. De la technologie et du design aux affaires et au développement personnel, nous proposons des cours adaptés pour vous aider à atteindre vos objectifs.
           </TranslatedText>
          </p>

          <h4 className="text-xl font-medium text-blackColor dark:text-blackColor font-thinor-dark dark:text-blackColor-dark">
            <TranslatedText>
            Expérience d'apprentissage interactive
            </TranslatedText>
          </h4>
          <p className="text-contentColor dark:text-contentColor-dark mb-30px">
           <TranslatedText>
             Les étudiants peuvent participer à des quiz, des devoirs et des discussions pour approfondir leur compréhension. Notre plateforme prend en charge des parcours d'apprentissage flexibles qui s'adaptent à votre emploi du temps et à votre rythme.
            </TranslatedText>
          </p>

          <h4 className="text-xl font-medium text-blackColor dark:text-blackColor font-thinor-dark dark:text-blackColor-dark">
            <TranslatedText>
            Communauté et soutien
            </TranslatedText>
          </h4>
          <p className="text-contentColor dark:text-contentColor-dark mb-30px">
            <TranslatedText>
            Rejoignez une communauté solidaire où les apprenants et les instructeurs se connectent, collaborent et évoluent ensemble. Nous offrons un soutien dédié pour garantir que votre parcours éducatif soit fluide et enrichissant.
            </TranslatedText>
          </p>
        </>
      ) : (
        <Image
          src={isHome9 || isHome9Dark ? overviewKidImage : overviewImage}
          alt="Tanga Academie Overview"
          className="w-full"
          placeholder="blur"
        />
      )}
    </div>
  );
};

export default AboutContent;
