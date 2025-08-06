"use client";
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText, LANGUAGE_CODES } from '@/services/translateService';
import { useState, useEffect } from 'react';

/**
 * Custom hook for easy text translation
 * @param {string} text - Text to translate
 * @param {Object} options - Translation options
 * @returns {string} - Translated text
 */
export const useTranslation = (text, options = {}) => {
  const { 
    currentLanguage, 
    getCachedTranslation, 
    setCachedTranslation,
    languages 
  } = useLanguage();

  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (!text || !text.trim()) {
        setTranslatedText(text);
        return;
      }

      // If current language is French (default), no translation needed
      if (currentLanguage === languages.FRENCH) {
        setTranslatedText(text);
        return;
      }

      // Check cache first
      const cached = getCachedTranslation(text, currentLanguage);
      if (cached) {
        setTranslatedText(cached);
        return;
      }

      // Perform translation
      setIsLoading(true);
      try {
        const translated = await translateText(text, currentLanguage, languages.FRENCH);
        setTranslatedText(translated);
        setCachedTranslation(text, currentLanguage, translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(text); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [text, currentLanguage]);

  return { translatedText, isLoading };
};

/**
 * Simple translate function for immediate use
 * @param {string} text - Text to translate
 * @returns {string} - Translated text
 */
export const t = (text) => {
  const { translatedText } = useTranslation(text);
  return translatedText;
};

export default useTranslation;