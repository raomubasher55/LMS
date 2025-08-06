"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText } from '@/services/translateService';
import TranslatedText from './TranslatedText';
import { FaGlobe } from 'react-icons/fa';

const LanguageDebugger = () => {
  const { 
    currentLanguage, 
    switchLanguage, 
    languages, 
    languageNames, 
    getCacheStats,
    clearCache 
  } = useLanguage();
  
  const [testText, setTestText] = useState("Bonjour le monde");
  const [testResult, setTestResult] = useState("");
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const testTranslationAPI = async () => {
    setIsTestingAPI(true);
    try {
      const result = await translateText(testText, languages.ENGLISH, languages.FRENCH);
      setTestResult(result.success ? result.data : `Error: ${result.error}`);
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    } finally {
      setIsTestingAPI(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    setTestResult("Cache cleared!");
  };

  const cacheStats = getCacheStats();

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-600 text-sm"
          title="Open Language Debug Panel"
        >
          <FaGlobe className="inline mr-1" /> {currentLanguage.toUpperCase()}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-sm z-50 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold">Language Debug Panel</h3>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ✕
        </button>
      </div>
      
      {/* Current Language */}
      <div className="mb-2 text-xs">
        <strong>Current:</strong> {languageNames[currentLanguage]} ({currentLanguage})
      </div>

      {/* Language Switcher */}
      <div className="mb-2">
        <button
          onClick={() => switchLanguage(currentLanguage === languages.FRENCH ? languages.ENGLISH : languages.FRENCH)}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-1"
        >
          Switch to {currentLanguage === languages.FRENCH ? 'English' : 'French'}
        </button>
      </div>

      {/* Cache Statistics */}
      <div className="mb-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded">
        <div className="font-semibold mb-1">Cache Stats:</div>
        <div>Size: {cacheStats.size}/{cacheStats.maxSize} ({cacheStats.usagePercent}%)</div>
        <div>Hit Rate: {cacheStats.hitRate}</div>
        <div>Hits: {cacheStats.hits} | Misses: {cacheStats.misses}</div>
        <button
          onClick={handleClearCache}
          className="mt-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
        >
          Clear Cache
        </button>
      </div>

      {/* API Test */}
      <div className="mb-2">
        <div className="text-xs mb-1"><strong>API Test:</strong></div>
        <input
          type="text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="w-full text-xs p-1 border rounded mb-1 dark:bg-gray-700 dark:border-gray-600"
          placeholder="Text to test"
        />
        <button
          onClick={testTranslationAPI}
          disabled={isTestingAPI}
          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isTestingAPI ? 'Testing...' : 'Test API'}
        </button>
        {testResult && (
          <div className="mt-1 text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded">
            <strong>Result:</strong> {testResult}
          </div>
        )}
      </div>

      {/* Component Test */}
      <div className="mb-2">
        <div className="text-xs mb-1"><strong>Component Test:</strong></div>
        <div className="text-xs bg-yellow-100 dark:bg-yellow-900 p-1 rounded">
          <TranslatedText showError={true}>Bonjour le monde</TranslatedText>
        </div>
      </div>

      {/* Environment Check */}
      <div className="mb-2 text-xs">
        <strong>API Key:</strong> {process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY ? '✅ Set' : '❌ Missing'}
      </div>

      {/* Performance Info */}
      <div className="text-xs bg-blue-50 dark:bg-blue-900 p-2 rounded">
        <div className="font-semibold mb-1">Performance:</div>
        <div>🚀 Debounced translations</div>
        <div>💾 Intelligent caching</div>
        <div>🔄 Auto-cleanup expired entries</div>
        <div>⚡ Memoized components</div>
      </div>
    </div>
  );
};

export default LanguageDebugger;