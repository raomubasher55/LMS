import CreateCoursePrimary from "@/components/sections/create-course/CreateCoursePrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import TranslatedText from "@/components/shared/TranslatedText";
import React from "react";

const CreateCourseMain = () => {
  return (
    <>
      <HeroPrimary path={<TranslatedText>Créer un cours</TranslatedText>} title={<TranslatedText>Créer un cours</TranslatedText>
} />
      <CreateCoursePrimary />
    </>
  );
};

export default CreateCourseMain;
