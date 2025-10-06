"use client";
import Image from "next/image";
import React from "react";
import logoImage from "@/assets/images/logo/tanga.jpeg";
import useIsSecondary from "@/hooks/useIsSecondary";
import TranslatedText from "@/components/shared/TranslatedText";

const CopyRight = () => {
  const { isSecondary } = useIsSecondary();
  return (
    <div>
      {isSecondary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-10 lg:mt-4 items-center border-t border-darkcolor">
          <div>
            <p className="text-base text-center sm:text-start text-darkgray">
              © 2025{" "}
              <a href="#" className="hover:text-primaryColor">
                Tanga Academie
              </a>
              .{" "}
              <TranslatedText>
                Tous droits réservés. Développé par
              </TranslatedText>{" "}
              <a
                href="www.linkedin.com/in/zahid-ghotia"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primaryColor"
              >
                Ghotia.Dev
              </a>
            </p>
          </div>

          <div>
            <ul className="flex items-center justify-center sm:justify-end">
              <li>
                <a
                  href="/about"
                  className="text-base text-darkgray hover:text-primaryColor pr-4 border-r border-darkgray"
                >
                  <TranslatedText>À propos de nous</TranslatedText>
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-base text-darkgray hover:text-primaryColor pl-4"
                >
                  <TranslatedText>Politique de confidentialité</TranslatedText>
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-30px pt-10 items-center">
          <div className="lg:col-start-1 lg:col-span-3">
            <a href="/">
              <Image
                src={logoImage}
                alt="Tanga Academy Logo"
                placeholder="blur"
              />
            </a>
          </div>

          <div className="lg:col-start-4 lg:col-span-6 text-center lg:text-left">
            <p className="dark:text-whiteColor text-center">
              © 2025 <span className="text-primaryColor">Tanga Academie</span>.{" "}
              <TranslatedText>Tous droits réservés</TranslatedText>. <br />
              <TranslatedText>Développé par</TranslatedText>{" "}
              <a
                href="https://www.linkedin.com/in/zahid-ghotia"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primaryColor"
              >
                Ghotia.Dev
              </a>
            </p>
          </div>

          <div className="lg:col-start-10 lg:col-span-3">
            <ul className="flex gap-3 lg:gap-2 2xl:gap-3 lg:justify-end">
              {[
                { icon: "facebook", link: "https://www.facebook.com" },
                { icon: "twitter", link: "https://www.twitter.com" },
                { icon: "vimeo", link: "https://www.vimeo.com" },
                { icon: "linkedin", link: "https://www.linkedin.com" },
                { icon: "skype", link: "https://www.skype.com" },
              ].map(({ icon, link }) => (
                <li key={icon}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center text-[#2C3340] hover:text-whiteColor dark:text-whiteColor bg-[#2c3340] bg-opacity-10 hover:bg-primaryColor"
                  >
                    <i className={`icofont-${icon}`}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyRight;
