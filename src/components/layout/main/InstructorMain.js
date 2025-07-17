import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import InstructorsPrimary from "@/components/sections/instructors/InstructorsPrimary";
import TranslatedText from "@/components/shared/TranslatedText";
import React from "react";

const InstructorMain = () => {
  return (
    <>
      <HeroPrimary path={<TranslatedText>Instructeur Page</TranslatedText>} 
      title={<TranslatedText>Instructeur Page</TranslatedText>} />
      <InstructorsPrimary />
    </>
  );
};

export default InstructorMain;
