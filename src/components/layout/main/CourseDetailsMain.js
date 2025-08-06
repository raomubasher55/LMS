import CourseDetailsPrimary from "@/components/sections/course-details/CourseDetailsPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import TranslatedText from "@/components/shared/TranslatedText";
import React from "react";

const CourseDetailsMain = ({ id }) => {
  return (
    <>
      <HeroPrimary path={<TranslatedText>Détails du cours</TranslatedText>} title={<TranslatedText>Détails du cours</TranslatedText>} />
      <CourseDetailsPrimary id={id} />
    </>
  );
};

export default CourseDetailsMain;
