"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Supported languages
export const LANGUAGES = {
  FRENCH: 'fr',
  ENGLISH: 'en'
};

export const LANGUAGE_NAMES = {
  [LANGUAGES.FRENCH]: 'Français',
  [LANGUAGES.ENGLISH]: 'English'
};

// Cache configuration
const CACHE_CONFIG = {
  MAX_SIZE: 500, // Maximum number of cached translations
  CLEANUP_THRESHOLD: 0.8, // Clean up when cache reaches 80% of max size
  CLEANUP_PERCENTAGE: 0.3, // Remove 30% of oldest entries during cleanup
  TTL: 1000 * 60 * 60 * 24, // 24 hours TTL for cache entries
};

// Create Language Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.FRENCH); // Default to French
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState(new Map());
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0, size: 0 });

  // Load saved language preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language');
      if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage);
      }
      
      // Load cached translations from localStorage if available
      loadCacheFromStorage();
    }

    // Cleanup old cache entries on mount
    cleanupExpiredEntries();
  }, []);

  // Save cache to localStorage periodically
  useEffect(() => {
    if (typeof window !== 'undefined' && translationCache.size > 0) {
      const saveTimer = setTimeout(() => {
        saveCacheToStorage();
      }, 5000); // Save every 5 seconds if cache has changed

      return () => clearTimeout(saveTimer);
    }
  }, [translationCache]);

  // Load cache from localStorage
  const loadCacheFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedCache = localStorage.getItem('translation-cache');
      if (savedCache) {
        const cacheData = JSON.parse(savedCache);
        const newCache = new Map();
        
        // Convert array back to Map and filter expired entries
        const now = Date.now();
        cacheData.forEach(([key, value]) => {
          if (value.timestamp && (now - value.timestamp) < CACHE_CONFIG.TTL) {
            newCache.set(key, value);
          }
        });
        
        setTranslationCache(newCache);
        setCacheStats(prev => ({ ...prev, size: newCache.size }));
      }
    } catch (error) {
      console.warn('Failed to load translation cache from storage:', error);
    }
  }, []);

  // Save cache to localStorage
  const saveCacheToStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      if (translationCache.size > 0) {
        // Convert Map to array for JSON serialization
        const cacheArray = Array.from(translationCache.entries());
        localStorage.setItem('translation-cache', JSON.stringify(cacheArray));
      }
    } catch (error) {
      console.warn('Failed to save translation cache to storage:', error);
    }
  }, [translationCache]);

  // Clean up expired cache entries
  const cleanupExpiredEntries = useCallback(() => {
    const now = Date.now();
    const newCache = new Map();
    
    translationCache.forEach((value, key) => {
      if (value.timestamp && (now - value.timestamp) < CACHE_CONFIG.TTL) {
        newCache.set(key, value);
      }
    });
    
    if (newCache.size !== translationCache.size) {
      setTranslationCache(newCache);
      setCacheStats(prev => ({ ...prev, size: newCache.size }));
    }
  }, [translationCache]);

  // Clean up oldest entries when cache is too large
  const cleanupOldestEntries = useCallback(() => {
    if (translationCache.size <= CACHE_CONFIG.MAX_SIZE * CACHE_CONFIG.CLEANUP_THRESHOLD) {
      return;
    }

    // Convert to array, sort by timestamp, keep newest entries
    const entries = Array.from(translationCache.entries());
    entries.sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));
    
    const keepCount = Math.floor(translationCache.size * (1 - CACHE_CONFIG.CLEANUP_PERCENTAGE));
    const newCache = new Map(entries.slice(0, keepCount));
    
    setTranslationCache(newCache);
    setCacheStats(prev => ({ ...prev, size: newCache.size }));
  }, [translationCache]);

  // Save language preference to localStorage
  const saveLanguagePreference = useCallback((language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', language);
    }
  }, []);

  // Switch language function
  const switchLanguage = useCallback((newLanguage) => {
    if (Object.values(LANGUAGES).includes(newLanguage) && newLanguage !== currentLanguage) {
      setCurrentLanguage(newLanguage);
      saveLanguagePreference(newLanguage);
      
      // Don't clear cache when switching languages - translations are still valid
      // Just update the cache stats
      setCacheStats(prev => ({ ...prev, size: translationCache.size }));
    }
  }, [currentLanguage, saveLanguagePreference, translationCache.size]);

  // Toggle between French and English
  const toggleLanguage = useCallback(() => {
    const newLanguage = currentLanguage === LANGUAGES.FRENCH ? LANGUAGES.ENGLISH : LANGUAGES.FRENCH;
    switchLanguage(newLanguage);
  }, [currentLanguage, switchLanguage]);

  // Create cache key with proper format
  const createCacheKey = useCallback((text, targetLang, sourceLang = null) => {
    return `${sourceLang || 'auto'}_${targetLang}_${text.slice(0, 100)}`;
  }, []);

  // Get translation from cache
  const getCachedTranslation = useCallback((text, targetLang, sourceLang = null) => {
    const cacheKey = createCacheKey(text, targetLang, sourceLang);
    const cached = translationCache.get(cacheKey);
    
    if (cached) {
      // Check if cache entry is still valid
      const now = Date.now();
      if (!cached.timestamp || (now - cached.timestamp) < CACHE_CONFIG.TTL) {
        setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
        return cached.translation;
      } else {
        // Remove expired entry
        translationCache.delete(cacheKey);
        setCacheStats(prev => ({ ...prev, size: prev.size - 1 }));
      }
    }
    
    setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
    return null;
  }, [translationCache, createCacheKey]);

  // Set translation in cache
  const setCachedTranslation = useCallback((text, targetLang, translation, sourceLang = null) => {
    if (!text || !translation) return;
    
    const cacheKey = createCacheKey(text, targetLang, sourceLang);
    const cacheEntry = {
      translation,
      timestamp: Date.now(),
      accessCount: 1
    };
    
    // Create new Map to trigger React re-render
    const newCache = new Map(translationCache);
    newCache.set(cacheKey, cacheEntry);
    
    setTranslationCache(newCache);
    setCacheStats(prev => ({ ...prev, size: newCache.size }));
    
    // Cleanup if cache is getting too large
    if (newCache.size >= CACHE_CONFIG.MAX_SIZE * CACHE_CONFIG.CLEANUP_THRESHOLD) {
      // Use setTimeout to avoid blocking the UI
      setTimeout(() => cleanupOldestEntries(), 0);
    }
  }, [translationCache, createCacheKey, cleanupOldestEntries]);

  // Clear entire cache
  const clearCache = useCallback(() => {
    setTranslationCache(new Map());
    setCacheStats({ hits: 0, misses: 0, size: 0 });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('translation-cache');
    }
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    const hitRate = cacheStats.hits + cacheStats.misses > 0 
      ? (cacheStats.hits / (cacheStats.hits + cacheStats.misses) * 100).toFixed(1)
      : 0;
    
    return {
      ...cacheStats,
      hitRate: `${hitRate}%`,
      maxSize: CACHE_CONFIG.MAX_SIZE,
      usagePercent: (cacheStats.size / CACHE_CONFIG.MAX_SIZE * 100).toFixed(1)
    };
  }, [cacheStats]);

  // Check if current language is French (default)
  const isFrench = useCallback(() => currentLanguage === LANGUAGES.FRENCH, [currentLanguage]);

  // Check if current language is English
  const isEnglish = useCallback(() => currentLanguage === LANGUAGES.ENGLISH, [currentLanguage]);

  // Get current language name
  const getCurrentLanguageName = useCallback(() => LANGUAGE_NAMES[currentLanguage], [currentLanguage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      saveCacheToStorage();
    };
  }, [saveCacheToStorage]);

  // Context value
  const value = {
    currentLanguage,
    isTranslating,
    setIsTranslating,
    switchLanguage,
    toggleLanguage,
    getCachedTranslation,
    setCachedTranslation,
    clearCache,
    getCacheStats,
    isFrench,
    isEnglish,
    getCurrentLanguageName,
    languages: LANGUAGES,
    languageNames: LANGUAGE_NAMES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use Language Context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// HOC to wrap components with language functionality
export const withLanguage = (Component) => {
  return function LanguageWrapper(props) {
    const languageProps = useLanguage();
    return <Component {...props} {...languageProps} />;
  };
};

export default LanguageContext;