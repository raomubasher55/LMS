import CoursesPrimary from "@/components/sections/courses/CoursesPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import TranslatedText from "@/components/shared/TranslatedText";

const CourseGridMain = () => {
  return (
    <>
      <HeroPrimary path={<TranslatedText>Grille des cours</TranslatedText>} title={<TranslatedText>Grille des cours</TranslatedText>}/>
      <CoursesPrimary isNotSidebar={true} />
    </>
  );
};

export default CourseGridMain;
