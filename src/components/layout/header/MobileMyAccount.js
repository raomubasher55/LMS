import TranslatedText from "@/components/shared/TranslatedText";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const MobileMyAccount = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  useEffect(() => {
    // Check localStorage for user data
    const checkUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Function to get dashboard URL based on user role
  const getDashboardUrl = (role) => {
    switch (role) {
      case 'admin':
        return '/dashboards/admin-dashboard';
      case 'instructor':
        return '/dashboards/instructor-dashboard';
      case 'student':
        return '/dashboards/student/dashboard';
      default:
        return '/dashboards/student-dashboard';
    }
  };

  // Toggle accordion
  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div>
        <ul className="accordion-container mt-9 mb-30px pb-9 border-b border-borderColor dark:border-borderColor-dark">
          <li className="accordion group">
            <div className="accordion-controller flex items-center justify-between">
              <span className="leading-1 text-darkdeep1 font-medium dark:text-whiteColor">
                <TranslatedText>Chargement...</TranslatedText>
              </span>
            </div>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <ul className="accordion-container mt-9 mb-30px pb-9 border-b border-borderColor dark:border-borderColor-dark">
        <li className="accordion group">
          {/*  accordion header */}
          <div className="accordion-controller flex items-center justify-between">
            <button
              onClick={toggleAccordion}
              className="leading-1 text-darkdeep1 font-medium group-hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor w-full text-left flex items-center justify-between"
            >
              <span><TranslatedText>Mon Compte</TranslatedText></span>
              <i className={`icofont-thin-down text-size-15 text-darkdeep1 group-hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor transition-transform duration-300 ${isAccordionOpen ? 'rotate-180' : ''}`}></i>
            </button>
          </div>
          
          {/*  accordion content */}
          <div className={`accordion-content overflow-hidden transition-all duration-500 shadow-standard ${isAccordionOpen ? 'h-auto max-h-96' : 'h-0'}`}>
            <div className="content-wrapper">
              <ul>
                {user ? (
                  // User is logged in - show dashboard link
                  <li>
                    <div className="flex items-center justify-between">
                      <Link
                        href={getDashboardUrl(user.role)}
                        className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                      >
                        {user.role === "admin" ? (
                          <TranslatedText>Tableau de bord Admin</TranslatedText>
                        ) : user.role === "instructor" ? (
                          <TranslatedText>Tableau de bord Instructeur</TranslatedText>
                        ) : (
                          <TranslatedText>Tableau de bord Étudiant</TranslatedText>
                        )}
                      </Link>
                    </div>
                  </li>
                ) : (
                  // User is not logged in - show login/create account options
                  <>
                    <li>
                      <div className="flex items-center gap-1">
                        <Link
                          href="/login"
                          className="leading-1 text-darkdeep1 text-sm pl-30px pt-7 pb-3 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          <TranslatedText>Connexion</TranslatedText>
                        </Link>

                        <Link
                          href="/login"
                          className="leading-1 text-darkdeep1 text-sm pr-30px pt-7 pb-4 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                        >
                          <span>/</span> 
                          <TranslatedText>Créer un compte</TranslatedText>
                        </Link>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MobileMyAccount;