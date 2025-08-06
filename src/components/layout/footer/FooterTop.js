"use client";
import { useState } from "react";
import useIsSecondary from "@/hooks/useIsSecondary";
import FooterTopLeft from "./FooterTopLeft";
import TranslatedText from "@/components/shared/TranslatedText";

const FooterTop = () => {
  const { isSecondary } = useIsSecondary();
  
  // State management
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error, info

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous messages
    setMessage("");
    setMessageType("");
    
    // Basic email validation
    if (!email) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }
    
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'website',
          preferences: {
            frequency: 'weekly',
            categories: ['general']
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message || "Successfully subscribed to newsletter!");
        setMessageType("success");
        setEmail(""); // Clear the form
      } else {
        setMessage(data.message || "Failed to subscribe. Please try again.");
        setMessageType(data.message?.includes("already subscribed") ? "info" : "error");
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage("Network error. Please check your connection and try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Auto-hide message after 5 seconds
  useState(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <section>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 md:gap-y-0 items-center pb-45px border-b border-darkcolor ${
          isSecondary ? "gap-y-5" : "gap-y-30px"
        }`}
      >
        <FooterTopLeft />
        <div data-aos="fade-up">
          <form 
            onSubmit={handleSubmit}
            className="max-w-form-xl md:max-w-form-md lg:max-w-form-lg xl:max-w-form-xl 2xl:max-w-form-2xl dark:bg-deepgray ml-auto rounded relative"
          >
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email ici"
                disabled={isLoading}
                className={`dark:text-whiteColor h-62px pl-15px focus:outline-none border dark:border-deepgray focus:border-whitegrey bg-transparent rounded w-full transition-colors duration-200 ${
                  messageType === "error" 
                    ? "border-red-500 focus:border-red-500" 
                    : messageType === "success"
                    ? "border-green-500 focus:border-green-500"
                    : "border-gray-400"
                } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className={`px-3 md:px-10px lg:px-5 text-xs lg:text-size-15 text-whiteColor border rounded absolute right-0 top-0 h-full transition-all duration-200 ${
                  isLoading || !email.trim()
                    ? "bg-gray-500 border-gray-400 cursor-not-allowed opacity-70"
                    : "bg-primaryColor hover:bg-deepgray border-primaryColor hover:border-deepgray"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden lg:inline">Subscribing...</span>
                  </div>
                ) : (
                  <TranslatedText>Abonnez-vous maintenant</TranslatedText>
                )}
              </button>
            </div>
          </form>
          
          {/* Message Display */}
          {message && (
            <div 
              className={`mt-3 p-3 rounded text-sm transition-all duration-300 ${
                messageType === "success"
                  ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                  : messageType === "error"
                  ? "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
                  : messageType === "info"
                  ? "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
                  : "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {messageType === "success" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {messageType === "error" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {messageType === "info" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="flex-1">{message}</span>
                <button
                  onClick={() => {
                    setMessage("");
                    setMessageType("");
                  }}
                  className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FooterTop;