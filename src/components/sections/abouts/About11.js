import Image from "next/image";

import aboutImage8 from "@/assets/images/about/about_8.png";
import aboutImage14 from "@/assets/images/about/about_14.png";
import aboutImage15 from "@/assets/images/about/about_15.png";
import SectionName from "@/components/shared/section-names/SectionName";

import HeadingSecondary from "@/components/shared/headings/HeadingSecondary";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";

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
                  alt="Tanga Academy Learning"
                />
                <Image className="w-full" src={aboutImage14} alt="Tanga Academy Students" />
              </div>
            </TiltWrapper>
          </div>
          {/* about right */}
          <div data-aos="fade-up" className="2xl:ml-65px">
            <SectionName>About Us</SectionName>
            <HeadingSecondary>
              Welcome to Tanga Academy — Your Online Learning Hub
            </HeadingSecondary>
            <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-25px">
              Tanga Academy is a dynamic online learning platform where expert instructors sell courses and students discover, enroll, and master new skills. Our mission is to empower lifelong learning with accessible, high-quality education.
            </p>
            <p className="flex items-center gap-x-4 text-lg text-blackColor dark:text-blackColor-dark mb-25px">
              <Image loading="lazy" src={aboutImage15} alt="Experience Icon" />
              <span>
                <b>Trusted by 5000+ Students & Instructors</b> worldwide, delivering quality education and fostering growth.
              </span>
            </p>
            <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark">
              Whether you are an instructor looking to share your expertise or a student eager to learn, Tanga Academy offers a seamless experience to create, manage, and access courses anytime, anywhere. Join us today and be part of a vibrant learning community!
            </p>

            <div className="mt-30px">
              <ButtonPrimary path="/about" arrow={true}>
                Learn More
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About11;
