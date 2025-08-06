import CoursesPrimary from "@/components/sections/courses/CoursesPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import TranslatedText from "@/components/shared/TranslatedText";

const CourseListMain = () => {
  return (
    <>
      <HeroPrimary path={<TranslatedText>Liste des cours</TranslatedText> } title={<TranslatedText>Liste des cours</TranslatedText>} />
      <CoursesPrimary isNotSidebar={true} isList={true} />
    </>
  );
};

export default CourseListMain;
