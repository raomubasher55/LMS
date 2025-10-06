import About11 from "@/components/sections/abouts/About11";
import Brands from "@/components/sections/brands/Brands";
import FeatureCourses from "@/components/sections/featured-courses/FeatureCourses";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import Overview from "@/components/sections/overviews/Overview";
import Testimonials from "@/components/sections/testimonials/Testimonials";
import TranslatedText from "@/components/shared/TranslatedText";

const AboutMain = () => {
  return (
    <>
      <HeroPrimary
        title={<TranslatedText>Page à propos</TranslatedText>}
        path={<TranslatedText>Page à propos</TranslatedText>}
      />
      <About11 />
      <Overview />
      <FeatureCourses
        title={
          <>
            <TranslatedText>
              Choisissez le meilleur forfait <br />
              pour votre apprentissage
            </TranslatedText>
          </>
        }
        course="2"
        subTitle="Cours populaires"
      />
      <Testimonials />
      <Brands />
    </>
  );
};

export default AboutMain;
