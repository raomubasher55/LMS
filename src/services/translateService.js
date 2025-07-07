/**
 * Google Translate API Service
 * Handles translation between French (default) and English
 */

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Language codes
export const LANGUAGE_CODES = {
  FRENCH: 'fr',
  ENGLISH: 'en'
};

// Translation errors for user feedback
export const TRANSLATION_ERRORS = {
  NO_API_KEY: 'Translation service not configured',
  NETWORK_ERROR: 'Unable to connect to translation service',
  QUOTA_EXCEEDED: 'Translation quota exceeded',
  INVALID_LANGUAGE: 'Invalid language code',
  GENERAL_ERROR: 'Translation service temporarily unavailable'
};

/**
 * Normalize error messages for user feedback
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
const getErrorMessage = (error) => {
  if (!API_KEY) return TRANSLATION_ERRORS.NO_API_KEY;
  if (error.message.includes('403')) return TRANSLATION_ERRORS.QUOTA_EXCEEDED;
  if (error.message.includes('network') || error.message.includes('fetch')) return TRANSLATION_ERRORS.NETWORK_ERROR;
  if (error.message.includes('400')) return TRANSLATION_ERRORS.INVALID_LANGUAGE;
  return TRANSLATION_ERRORS.GENERAL_ERROR;
};

/**
 * Translate text using Google Translate API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (fr/en)
 * @param {string} sourceLanguage - Source language code (optional)
 * @returns {Promise<{success: boolean, data: string, error?: string}>} - Translation result
 */
export const translateText = async (text, targetLanguage, sourceLanguage = null) => {
  // Don't translate if text is empty
  if (!text || !text.trim()) {
    return { success: true, data: text };
  }

  // If no API key, return original text
  if (!API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Translate API key not configured');
    }
    return { success: false, data: text, error: TRANSLATION_ERRORS.NO_API_KEY };
  }

  // Auto-detect source language if not provided
  const sourceLang = sourceLanguage || (targetLanguage === LANGUAGE_CODES.ENGLISH ? LANGUAGE_CODES.FRENCH : LANGUAGE_CODES.ENGLISH);
  
  // Don't translate if source and target are the same
  if (sourceLang === targetLanguage) {
    return { success: true, data: text };
  }

  try {
    const requestBody = {
      q: text,
      target: targetLanguage,
      source: sourceLang,
      format: 'text'
    };

    const response = await fetch(`${TRANSLATE_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`Translation API error: ${response.status} - ${errorText}`);
      throw error;
    }

    const data = await response.json();
    
    if (data.data && data.data.translations && data.data.translations.length > 0) {
      const translatedText = data.data.translations[0].translatedText;
      return { success: true, data: translatedText };
    } else {
      throw new Error('No translation received from API');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Translation error:', error);
    }
    return { 
      success: false, 
      data: text, // Return original text as fallback
      error: getErrorMessage(error)
    };
  }
};

/**
 * Translate multiple texts in batch
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional)
 * @returns {Promise<{success: boolean, data: string[], error?: string}>} - Translation result
 */
export const translateBatch = async (texts, targetLanguage, sourceLanguage = null) => {
  if (!texts || texts.length === 0) {
    return { success: true, data: [] };
  }

  if (!API_KEY) {
    return { 
      success: false, 
      data: texts, 
      error: TRANSLATION_ERRORS.NO_API_KEY 
    };
  }

  // Filter out empty texts and keep track of indices
  const nonEmptyTexts = [];
  const textIndices = [];
  
  texts.forEach((text, index) => {
    if (text && text.trim()) {
      nonEmptyTexts.push(text);
      textIndices.push(index);
    }
  });

  if (nonEmptyTexts.length === 0) {
    return { success: true, data: texts };
  }

  const sourceLang = sourceLanguage || (targetLanguage === LANGUAGE_CODES.ENGLISH ? LANGUAGE_CODES.FRENCH : LANGUAGE_CODES.ENGLISH);
  
  if (sourceLang === targetLanguage) {
    return { success: true, data: texts };
  }

  try {
    const response = await fetch(`${TRANSLATE_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: nonEmptyTexts,
        target: targetLanguage,
        source: sourceLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.translations) {
      const translatedTexts = [...texts]; // Create a copy of original array
      
      // Replace translated texts at their original positions
      data.data.translations.forEach((translation, i) => {
        const originalIndex = textIndices[i];
        translatedTexts[originalIndex] = translation.translatedText;
      });
      
      return { success: true, data: translatedTexts };
    } else {
      throw new Error('No translations received from API');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Batch translation error:', error);
    }
    return { 
      success: false, 
      data: texts, // Return original texts as fallback
      error: getErrorMessage(error)
    };
  }
};

/**
 * Detect language of given text
 * @param {string} text - Text to detect language for
 * @returns {Promise<{success: boolean, data: string, error?: string}>} - Detection result
 */
export const detectLanguage = async (text) => {
  if (!text || !text.trim()) {
    return { success: true, data: LANGUAGE_CODES.FRENCH }; // Default to French
  }

  if (!API_KEY) {
    return { 
      success: false, 
      data: LANGUAGE_CODES.FRENCH, 
      error: TRANSLATION_ERRORS.NO_API_KEY 
    };
  }

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text
      })
    });

    if (!response.ok) {
      throw new Error(`Language detection error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.detections && data.data.detections.length > 0) {
      return { success: true, data: data.data.detections[0][0].language };
    } else {
      return { success: true, data: LANGUAGE_CODES.FRENCH }; // Default to French
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Language detection error:', error);
    }
    return { 
      success: false, 
      data: LANGUAGE_CODES.FRENCH, 
      error: getErrorMessage(error)
    };
  }
};

/**
 * Check if translation service is available
 * @returns {Promise<boolean>} - True if service is available
 */
export const isTranslationServiceAvailable = async () => {
  if (!API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Translate API key is not configured');
    }
    return false;
  }

  try {
    // Test with a simple translation
    const testResult = await translateText('test', LANGUAGE_CODES.ENGLISH, LANGUAGE_CODES.FRENCH);
    return testResult.success && testResult.data !== 'test';
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Translation service test failed:', error);
    }
    return false;
  }
};

/**
 * Utility function to clean HTML tags from text before translation
 * @param {string} text - Text that may contain HTML
 * @returns {string} - Clean text without HTML tags
 */
export const cleanTextForTranslation = (text) => {
  if (!text) return text;
  
  // Remove HTML tags but preserve the text content
  return text.replace(/<[^>]*>/g, '').trim();
};

/**
 * Get supported languages
 * @returns {Object} - Object containing supported language codes and names
 */
export const getSupportedLanguages = () => {
  return {
    [LANGUAGE_CODES.FRENCH]: 'Français',
    [LANGUAGE_CODES.ENGLISH]: 'English'
  };
};

/**
 * Create a cache key for translations
 * @param {string} text - Original text
 * @param {string} targetLang - Target language
 * @param {string} sourceLang - Source language
 * @returns {string} - Cache key
 */
export const createCacheKey = (text, targetLang, sourceLang) => {
  return `${sourceLang || 'auto'}_${targetLang}_${text.slice(0, 50)}`;
};

export default {
  translateText,
  translateBatch,
  detectLanguage,
  isTranslationServiceAvailable,
  cleanTextForTranslation,
  getSupportedLanguages,
  createCacheKey,
  LANGUAGE_CODES,
  TRANSLATION_ERRORS
};