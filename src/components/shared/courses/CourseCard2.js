"use client";
import { useWishlistContext } from "@/contexts/WshlistContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
let insId = 0;
const CourseCard2 = ({ course, card, isList, isNotSidebar }) => {
  const { addProductToWishlist } = useWishlistContext();
  const {
    id,
    title,
    chapters,
    totalDuration,
    bannerImage,
    price,
    offerType,
    insName,
    instructor,
    category,
  } = course;

  const depBgs = [
  // Design & Creative
  {
    category: "Art & Design",
    bg: "bg-secondaryColor",
    keywords: ["art", "design", "creative", "painting", "drawing", "illustration"]
  },
  {
    category: "Web Design",
    bg: "bg-greencolor2",
    keywords: ["web design", "ui", "ux", "interface", "user experience", "responsive design"]
  },
  {
    category: "Graphic Design",
    bg: "bg-yellow",
    keywords: ["graphic", "graphics", "logo", "branding", "photoshop", "illustrator", "poster"]
  },
  {
    category: "Art Painting",
    bg: "bg-secondaryColor2",
    keywords: ["painting", "canvas", "acrylic", "watercolor", "oil painting", "fine art"]
  },
  {
    category: "Photography",
    bg: "bg-orange",
    keywords: ["photography", "photo", "camera", "portrait", "landscape", "editing"]
  },

  // Development & Programming
  {
    category: "Development",
    bg: "bg-blue",
    keywords: ["development", "programming", "coding", "software", "developer"]
  },
  {
    category: "Web Development",
    bg: "bg-greencolor2",
    keywords: ["web development", "frontend", "backend", "fullstack", "html", "css", "javascript"]
  },
  {
    category: "App Development",
    bg: "bg-secondaryColor",
    keywords: ["app development", "mobile app", "android", "ios", "react native", "flutter"]
  },
  {
    category: "Web Application",
    bg: "bg-blue",
    keywords: ["web application", "web app", "spa", "pwa", "react", "vue", "angular"]
  },
  {
    category: "PHP Development",
    bg: "bg-yellow",
    keywords: ["php", "laravel", "symfony", "codeigniter", "wordpress", "server side"]
  },
  {
    category: "Mobile Application",
    bg: "bg-orange",
    keywords: ["mobile", "mobile app", "smartphone", "tablet", "cross platform"]
  },
  {
    category: "Data Science",
    bg: "bg-secondaryColor2",
    keywords: ["data science", "machine learning", "ai", "python", "analytics", "big data"]
  },

  // Languages & Communication
  {
    category: "English",
    bg: "bg-greencolor2",
    keywords: ["english", "grammar", "writing", "literature", "vocabulary"]
  },
  {
    category: "Spoken English",
    bg: "bg-blue",
    keywords: ["spoken english", "speaking", "conversation", "pronunciation", "fluency", "accent"]
  },
  {
    category: "Language Learning",
    bg: "bg-secondaryColor",
    keywords: ["language", "foreign language", "spanish", "french", "german", "mandarin"]
  },

  // Business & Professional
  {
    category: "Business",
    bg: "bg-orange",
    keywords: ["business", "entrepreneurship", "startup", "management", "leadership"]
  },
  {
    category: "Marketing",
    bg: "bg-yellow",
    keywords: ["marketing", "digital marketing", "seo", "social media", "advertising", "branding"]
  },
  {
    category: "Finance",
    bg: "bg-greencolor2",
    keywords: ["finance", "accounting", "investment", "trading", "cryptocurrency", "money"]
  },
  {
    category: "Project Management",
    bg: "bg-blue",
    keywords: ["project management", "agile", "scrum", "planning", "coordination"]
  },

  // Personal & Lifestyle
  {
    category: "Personal Development",
    bg: "bg-secondaryColor",
    keywords: ["personal development", "self improvement", "productivity", "motivation", "goals"]
  },
  {
    category: "Lifestyle",
    bg: "bg-secondaryColor2",
    keywords: ["lifestyle", "wellness", "life coaching", "habits", "mindfulness"]
  },
  {
    category: "Health & Fitness",
    bg: "bg-orange",
    keywords: ["health", "fitness", "exercise", "nutrition", "yoga", "workout", "wellness"]
  },
  {
    category: "Cooking",
    bg: "bg-yellow",
    keywords: ["cooking", "chef", "recipe", "baking", "culinary", "food", "kitchen"]
  },

  // Technology & IT
  {
    category: "IT & Software",
    bg: "bg-blue",
    keywords: ["it", "software", "technology", "computer", "system administration"]
  },
  {
    category: "Cybersecurity",
    bg: "bg-secondaryColor",
    keywords: ["cybersecurity", "security", "hacking", "penetration testing", "network security"]
  },
  {
    category: "Cloud Computing",
    bg: "bg-greencolor2",
    keywords: ["cloud", "aws", "azure", "google cloud", "devops", "docker", "kubernetes"]
  },

  // Education & Academic
  {
    category: "Academic",
    bg: "bg-secondaryColor2",
    keywords: ["academic", "university", "college", "research", "thesis", "study"]
  },
  {
    category: "Test Preparation",
    bg: "bg-orange",
    keywords: ["test prep", "exam", "sat", "gre", "ielts", "toefl", "certification"]
  },

  // Music & Entertainment
  {
    category: "Music",
    bg: "bg-yellow",
    keywords: ["music", "instrument", "guitar", "piano", "singing", "composition", "audio"]
  },
  {
    category: "Video & Animation",
    bg: "bg-blue",
    keywords: ["video", "animation", "editing", "motion graphics", "after effects", "premiere"]
  }
];

// Background colors array for cycling through when no match found
const defaultBackgrounds = [
  "bg-secondaryColor",
  "bg-blue", 
  "bg-secondaryColor2",
  "bg-greencolor2",
  "bg-orange",
  "bg-yellow"
];

// Enhanced function to get category background
const getCategoryBackground = (category, id = 0) => {
  if (!category) {
    // If no category provided, use default cycling
    const bgIndex = id % defaultBackgrounds.length;
    return defaultBackgrounds[bgIndex];
  }

  // Convert category to lowercase for better matching
  const categoryLower = category.toLowerCase().trim();
  
  // First, try exact category match
  let matchedCategory = depBgs.find(
    ({ category: cat }) => cat.toLowerCase() === categoryLower
  );

  // If no exact match, try keyword matching
  if (!matchedCategory) {
    matchedCategory = depBgs.find(({ keywords }) => 
      keywords.some(keyword => 
        categoryLower.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(categoryLower)
      )
    );
  }

  // If still no match, use cycling default backgrounds
  if (!matchedCategory) {
    const bgIndex = id % defaultBackgrounds.length;
    return defaultBackgrounds[bgIndex];
  }

  return matchedCategory.bg;
};


// Usage examples:
const cardBg1 = getCategoryBackground("Web Design"); // returns "bg-greencolor2"
const cardBg2 = getCategoryBackground("Spoken English"); // returns "bg-blue"
const cardBg3 = getCategoryBackground("Art Painting"); // returns "bg-secondaryColor2"
const cardBg4 = getCategoryBackground("PHP Development"); // returns "bg-yellow"
const cardBg5 = getCategoryBackground("Unknown Category", 1); // returns "bg-blue" (cycling)

// Advanced usage with partial matching:
const cardBg6 = getCategoryBackground("JavaScript Development"); // matches "Development" keyword
const cardBg7 = getCategoryBackground("Digital Art"); // matches "art" keyword
const cardBg8 = getCategoryBackground("English Speaking");

 const cardBg = depBgs?.find(
    ({ category: category1 }) => category1 === category
  )?.bg;
  insId = id;
  insId = insId % 6 ? insId % 6 : 6;

  const durationChange = (sec) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    
    // Format for course duration display
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
};
  return (
    <div className="w-full group grid-item rounded">
      <div className="tab-content-wrapper">
        <div
          className={`p-15px lg:pr-30px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark flex flex-wrap ${
            card ? "lg:flex-nowrap" : "md:flex-nowrap"
          } rounded`}
        >
          {/*  card bannerImage */}
          <div
            className={`relative overflow-hidden w-full leading-1 ${
              card ? " lg:w-2/5" : "md:w-35%"
            }`}
          >
            <Link
              href={`/courses/${id}`}
              className="w-full overflow-hidden rounded"
            >
              <Image
                src={bannerImage 
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${bannerImage}` 
                  : '/placeholder-course.jpg'}
                alt=""
                className="w-full transition-all duration-300 scale-105 group-hover:scale-110 -mb-1"
                unoptimized
                width={100}
                height={100}
              />
            </Link>
            <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
              <div>
                <p
                  className={`text-xs text-whiteColor px-4 py-[3px]  rounded font-semibold capitalize ${cardBg}`}
                >
                  {category}
                </p>
              </div>
              <button
                className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor"
                onClick={() =>
                  addProductToWishlist({
                   id
                  })
                }
              >
                <i className="icofont-heart-alt text-base py-1 px-2"></i>
              </button>
            </div>
          </div>
          {/*  card content */}
          <div className={`w-full ${card ? "lg:w-3/5" : "md:w-65% "}`}>
            <div
              className={`${`pl-0 md:pl-5  lg:pl-30px  ${
                isNotSidebar ? "2xl:pl-90px" : ""
              }`} 
              `}
            >
              <div className="grid grid-cols-2 mb-15px">
                <div className="flex items-center">
                  <div>
                    <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                  </div>
                  <div>
                    <span className="text-sm text-black dark:text-blackColor-dark">
                      {chapters?.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <i className="icofont-clock-time pr-5px text-primaryColor text-lg"></i>
                  </div>
                  <div>
                    <span className="text-sm text-black dark:text-blackColor-dark">
                      {durationChange(totalDuration)}
                    </span>
                  </div>
                </div>
              </div>
              <h4>
                <Link
                  href={`/courses/${id}`}
                  className={`${
                    card
                      ? "text-size-26 leading-30px "
                      : "text-xl 2xl:text-size-34 2xl:!leading-9"
                  }  font-semibold text-blackColor mb-10px  dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor`}
                >
                  {title}
                </Link>
              </h4>
              {/*  price */}
              <div className="text-lg font-medium text-black-brerry-light mb-4">
                ${price.toFixed(2)}
                <del className="text-sm text-lightGrey4 font-semibold">
                  / $67.00
                </del>
                <span
                  className={`ml-6 text-base font-semibold ${
                    offerType ? " text-greencolor" : " text-secondaryColor3"
                  }`}
                >
                  {offerType}
                </span>
              </div>
              {/*  bottom */}
              <div className="flex flex-wrap justify-between sm:flex-nowrap items-center gap-y-2 pt-15px border-t border-borderColor">
                {/*  author and rating*/}
                <div className="flex items-center flex-wrap">
                  <div>
                    <Link
                      href={`/instructors/${instructor.id}`}
                      className="text-sm font-medium font-hind flex items-center hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor"
                    >
                      <Image
                        className="w-[30px] h-[30px] rounded-full mr-15px"
                        src={instructor.profile 
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${instructor.profile}` 
                          : '/placeholder-user.jpg'}
                        alt=""
                        width={30}
                        height={30}
                        unoptimized
                      />
                      <span className="flex">{instructor.firstName}</span>
                    </Link>
                  </div>
                  <div className="text-start md:text-end ml-35px">
                    <i className="icofont-star text-size-15 text-yellow"></i>
                    <i className="icofont-star text-size-15 text-yellow"></i>
                    <i className="icofont-star text-size-15 text-yellow"></i>
                    <i className="icofont-star text-size-15 text-yellow"></i>

                    <span className="text-xs text-lightGrey6">{course.rating}</span>
                  </div>
                </div>

                <div>
                  <Link
                    className="text-sm lg:text-base text-blackColor hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor"
                    href={`//courses/${id}`}
                  >
                    Know Details
                    <i className="icofont-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard2;
