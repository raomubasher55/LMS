"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText, cleanTextForTranslation } from '@/services/translateService';

/**
 * TranslatedText Component
 * Automatically translates text content based on current language
 */
const TranslatedText = ({ 
  children, 
  text, 
  fallback = null,
  className = "",
  tag: Tag = null,
  showError = false,
  debounceMs = 300,
  ...props 
}) => {
  const { 
    currentLanguage, 
    getCachedTranslation, 
    setCachedTranslation, 
    setIsTranslating,
    languages 
  } = useLanguage();

  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Memoize the original text to prevent unnecessary re-renders
  const originalText = useMemo(() => {
    return text || (typeof children === 'string' ? children : '');
  }, [text, children]);

  // Memoize the clean text to avoid recalculating
  const cleanedText = useMemo(() => {
    if (!originalText || !originalText.trim()) return originalText;
    return cleanTextForTranslation(originalText);
  }, [originalText]);

  // Debounced translation function
  const debouncedTranslate = useCallback((textToTranslate, targetLanguage) => {
    // Clear existing timer
    setDebounceTimer(prevTimer => {
      if (prevTimer) {
        clearTimeout(prevTimer);
      }
      return null;
    });

    // Set new timer
    const timer = setTimeout(async () => {
      if (!textToTranslate || !textToTranslate.trim()) {
        setTranslatedText(textToTranslate);
        return;
      }

      // If current language is French (default), no translation needed
      if (targetLanguage === languages.FRENCH) {
        setTranslatedText(textToTranslate);
        return;
      }

      // Check cache first
      const cached = getCachedTranslation(textToTranslate, targetLanguage, languages.FRENCH);
      if (cached) {
        setTranslatedText(cached);
        setError(null);
        return;
      }

      // Perform translation
      setIsLoading(true);
      setIsTranslating(true);
      setError(null);

      try {
        const result = await translateText(textToTranslate, targetLanguage, languages.FRENCH);
        
        if (result.success) {
          setTranslatedText(result.data);
          setCachedTranslation(textToTranslate, targetLanguage, result.data, languages.FRENCH);
          setError(null);
        } else {
          // Translation failed, use original text
          setTranslatedText(textToTranslate);
          setError(result.error || 'Translation failed');
        }
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(textToTranslate); // Fallback to original text
        setError('Translation service error');
      } finally {
        setIsLoading(false);
        setIsTranslating(false);
      }
    }, debounceMs);

    setDebounceTimer(timer);
  }, [debounceMs, languages.FRENCH, getCachedTranslation, setCachedTranslation, setIsTranslating]);

  // Effect to handle translation when dependencies change
  useEffect(() => {
    if (cleanedText) {
      debouncedTranslate(cleanedText, currentLanguage);
    } else {
      setTranslatedText('');
    }
  }, [cleanedText, currentLanguage, debouncedTranslate]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      setDebounceTimer(prevTimer => {
        if (prevTimer) {
          clearTimeout(prevTimer);
        }
        return null;
      });
    };
  }, []);

  // If loading and fallback provided, show fallback
  if (isLoading && fallback) {
    return fallback;
  }

  // Render the translated text
  const content = translatedText || originalText;

  // Create loading indicator
  const loadingIndicator = isLoading && (
    <span className="ml-1 opacity-50 text-xs animate-pulse" title="Translating...">
      ⏳
    </span>
  );

  // Create error indicator
  const errorIndicator = error && showError && (
    <span className="ml-1 text-red-500 text-xs" title={error}>
      ⚠️
    </span>
  );

  if (Tag) {
    return (
      <Tag className={className} {...props}>
        {content}
        {loadingIndicator}
        {errorIndicator}
      </Tag>
    );
  }

  return (
    <span className={className} {...props}>
      {content}
      {loadingIndicator}
      {errorIndicator}
    </span>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(TranslatedText);