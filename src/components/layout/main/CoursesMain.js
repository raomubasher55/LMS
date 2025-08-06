import CoursesPrimary from "@/components/sections/courses/CoursesPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import TranslatedText from "@/components/shared/TranslatedText";
import React from "react";

const CoursesMain = () => {
  return (
    <>
      <HeroPrimary path={<TranslatedText>Cours en vedette</TranslatedText>} title={<TranslatedText>Cours en vedette</TranslatedText>} />
      <CoursesPrimary card={true} />
    </>
  );
};

export default CoursesMain;
