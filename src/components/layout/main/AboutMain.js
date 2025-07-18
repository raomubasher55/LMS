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
      <HeroPrimary title="About Page" path={"About Page"} />
      <About11 />
      <Overview />
      <FeatureCourses
        title={
          <>
          <TranslatedText>
            Choose The Best Package <br />
            For your Learning
          </TranslatedText>
          </>
        }
        course="2"
        subTitle="Popular Courses"
      />
      <Testimonials />
      <Brands />
    </>
  );
};

export default AboutMain;
