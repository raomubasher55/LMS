"use client";
import Image from "next/image";
import overviewImage from "@/assets/images/about/overview.jpg";
import overviewKidImage from "@/assets/images/about/overview_kg.png";
import useIsTrue from "@/hooks/useIsTrue";

const AboutContent = () => {
  const isHome9 = useIsTrue("/home-9");
  const isHome9Dark = useIsTrue("/home-9-dark");
  const isAbout = useIsTrue("/about");
  const isAboutDark = useIsTrue("/about-dark");

  return (
    <div>
      <p className="text-contentColor dark:text-contentColor-dark mb-25px">
        Tanga Academy is a vibrant online learning platform that connects passionate instructors with eager learners worldwide. We believe in empowering students through accessible, high-quality courses spanning a wide range of skills and industries.
      </p>

      {isAbout || isAboutDark ? (
        <>
          <h4 className="text-xl font-medium text-blackColor dark:text-blackColor font-thinor-dark dark:text-blackColor-dark">
            Expert-Led Courses Across Diverse Fields
          </h4>
          <p className="text-contentColor dark:text-contentColor-dark mb-25px">
            Our instructors are industry professionals dedicated to delivering practical and engaging content. From technology and design to business and personal development, we provide courses tailored to help you achieve your goals.
          </p>

          <h4 className="text-xl font-medium text-blackColor dark:text-blackColor font-thinor-dark dark:text-blackColor-dark">
            Interactive Learning Experience
          </h4>
          <p className="text-contentColor dark:text-contentColor-dark mb-30px">
            Students can engage with quizzes, assignments, and discussions to deepen their understanding. Our platform supports flexible learning paths that fit your schedule and pace.
          </p>

          <h4 className="text-xl font-medium text-blackColor dark:text-blackColor font-thinor-dark dark:text-blackColor-dark">
            Community and Support
          </h4>
          <p className="text-contentColor dark:text-contentColor-dark mb-30px">
            Join a supportive community where learners and instructors connect, collaborate, and grow together. We provide dedicated support to ensure your educational journey is smooth and rewarding.
          </p>
        </>
      ) : (
        <Image
          src={isHome9 || isHome9Dark ? overviewKidImage : overviewImage}
          alt="Tanga Academy Overview"
          className="w-full"
          placeholder="blur"
        />
      )}
    </div>
  );
};

export default AboutContent;
