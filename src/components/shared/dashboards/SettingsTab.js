"use client";
import TabButtonSecondary from "../buttons/TabButtonSecondary";
import useTab from "@/hooks/useTab";
import ProfileContent from "./ProfileContent";
import PasswordContent from "./PasswordContent";
import SocialIconContent from "./SocialIconContent";
import TabContentWrapper from "../wrappers/TabContentWrapper";
import TranslatedText from "../TranslatedText";

const SettingsTab = () => {
  const { currentIdx, handleTabClick } = useTab();

  const tabbuttons = [
    {
      name: <TranslatedText>Profil</TranslatedText>,
      content: <ProfileContent />,
    },
    {
      name: <TranslatedText>Mot de passe</TranslatedText>,
      content: <PasswordContent />,
    },
    {
      name: <TranslatedText>Icônes sociales</TranslatedText>,
      content: <SocialIconContent />,
    },
  ];

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* heading */}
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          <TranslatedText>Mon profil</TranslatedText>
        </h2>
      </div>

      <div>
        <div className="flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
          {tabbuttons.map(({ name }, idx) => (
            <TabButtonSecondary
              key={idx}
              name={name}
              currentIdx={currentIdx}
              idx={idx}
              handleTabClick={handleTabClick}
              button="small"
            />
          ))}
        </div>

        <div>
          {tabbuttons.map(({ content }, idx) => (
            <TabContentWrapper key={idx} isShow={currentIdx === idx}>
              {content}
            </TabContentWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
