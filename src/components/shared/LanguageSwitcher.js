"use client";
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!hasMounted) return null;

  // ✅ call useLanguage *after* mounting to avoid hydration mismatch
  const {
    currentLanguage,
    switchLanguage,
    isTranslating,
    languages,
    languageNames,
  } = useLanguage();

  const handleLanguageSelect = (langCode) => {
    if (!isTranslating && langCode !== currentLanguage) {
      switchLanguage(langCode);
      setIsOpen(false);
    }
  };

  const getFlagIcon = (langCode) => {
    switch (langCode) {
      case languages.FRENCH:
        return "🇫🇷";
      case languages.ENGLISH:
        return "🇬🇧";
      default:
        return "🌐";
    }
  };

  const getLanguageList = () => [
    {
      code: languages.FRENCH,
      name: languageNames[languages.FRENCH],
      flag: "🇫🇷",
    },
    {
      code: languages.ENGLISH,
      name: languageNames[languages.ENGLISH],
      flag: "🇬🇧",
    },
  ];



  return (
    <div className="language-switcher relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => !isTranslating && setIsOpen(!isOpen)}
        disabled={isTranslating}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300
          ${
            isTranslating
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          }
          ${isOpen ? "bg-gray-100 dark:bg-gray-700" : ""}
          text-sm font-medium text-contentColor dark:text-contentColor-dark
          border border-borderColor dark:border-borderColor-dark
          bg-whiteColor dark:bg-whiteColor-dark
        `}
        title="Select Language"
      >
        <span className="text-lg">{getFlagIcon(currentLanguage)}</span>
        <span className="uppercase text-xs font-bold">{currentLanguage}</span>

        {isTranslating ? (
          <div className="animate-spin h-3 w-3 border-2 border-primaryColor border-t-transparent rounded-full" />
        ) : (
          <svg
            className={`w-3 h-3 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isTranslating && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-whiteColor dark:bg-whiteColor-dark border border-borderColor dark:border-borderColor-dark rounded-md shadow-lg z-50">
          <div className="py-1">
            {getLanguageList().map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-200
                  ${
                    lang.code === currentLanguage
                      ? "bg-primaryColor text-whiteColor"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-contentColor dark:text-contentColor-dark"
                  }
                `}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-sm font-medium">{lang.name}</span>
                {lang.code === currentLanguage && (
                  <svg
                    className="w-4 h-4 text-whiteColor"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Translation Status Tooltip */}
      {isTranslating && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-primaryColor text-whiteColor text-xs px-2 py-1 rounded whitespace-nowrap">
            Translating...
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primaryColor rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
