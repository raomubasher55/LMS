import Error1 from "@/components/sections/error/Error1";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import TranslatedText from "@/components/shared/TranslatedText";
import React from "react";

const ErrorMain = () => {
  return (
    <>
      <HeroPrimary path={<TranslatedText>Page d’erreur</TranslatedText>} title={<TranslatedText>Page d’erreur</TranslatedText>} />
      <Error1 />
    </>
  );
};

export default ErrorMain;
