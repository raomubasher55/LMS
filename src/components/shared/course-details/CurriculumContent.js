"use client";

import accordions from "@/libs/accordions";
import Link from "next/link";
import { useEffect } from "react";

const CurriculumContent = ({ course, progressData }) => {
  useEffect(() => {
    accordions();
  }, []);

  // Helper function to get video duration
  const getVideoDuration = (chapter) => {
    const duration = chapter.video?.duration;
    
    if (!duration || isNaN(duration) || duration <= 0) {
      return 'N/A';
    }
    
    // Convert seconds to minutes
    const minutes = Math.floor(duration / 60);
    
    // If less than 1 minute, show "< 1"
    if (minutes < 1 && duration > 0) {
      return '< 1';
    }
    
    return minutes.toString();
  };

  const isChapterQuizPassed = (chapterId) => {
    if (!progressData?.quizProgress || !course?._id) {
      return false;
    }
    
    const quizAttempt = progressData.quizProgress.find(
      quiz => quiz.chapterId && quiz.chapterId.toString() === chapterId.toString() && 
             quiz.courseId && quiz.courseId.toString() === course._id.toString()
    );
    
    return quizAttempt && (quizAttempt.passed || (quizAttempt.bestScore && quizAttempt.bestScore >= 60));
  };

  const isChapterAccessible = (chapterIndex) => {
    // First chapter is always accessible
    if (chapterIndex === 0) return true;
    
    // For subsequent chapters, check if previous chapter's quiz was passed
    const previousChapter = course?.chapters?.[chapterIndex - 1];
    if (!previousChapter) return false;
    
    // If previous chapter has no quiz, it's automatically considered "passed"
    if (!previousChapter.quiz || previousChapter.quiz.length === 0) {
      return true;
    }
    
    // If previous chapter has a quiz, check if it was passed
    return isChapterQuizPassed(previousChapter._id);
  };


  return (
    <div>
      <ul className="accordion-container curriculum">
        {/* accordion  */}
        {course?.chapters?.map((chapter, index) => {
          const isAccessible = isChapterAccessible(index);
          const isQuizPassed = isChapterQuizPassed(chapter._id);
          
          return (
          <li key={chapter._id} className="accordion mb-25px overflow-hidden">
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-md">
              {/* Accordion Header */}
              <div className={`cursor-pointer accordion-controller flex justify-between items-center text-xl font-bold w-full px-5 py-18px font-hind leading-[20px] ${
                !isAccessible 
                  ? 'text-gray-400 dark:text-gray-500 opacity-60' 
                  : 'text-headingColor dark:text-headingColor-dark'
              }`}>
                <div className="flex items-center">
                  {!isAccessible && (
                    <i className="icofont-lock mr-2 text-gray-400"></i>
                  )}
                  {isQuizPassed && (
                    <i className="icofont-check-circled mr-2 text-green-600"></i>
                  )}
                  <span>{chapter.title}</span>
                  <p className={`text-xs px-10px py-0.5 ml-10px rounded-full ${
                    !isAccessible 
                      ? 'text-gray-400 bg-gray-200 dark:bg-gray-600' 
                      : 'text-headingColor dark:text-headingColor-dark bg-borderColor dark:bg-borderColor-dark'
                  }`}>
                    Lecture {index + 1}
                  </p>
                  {!isAccessible && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-2">
                      Locked
                    </span>
                  )}
                </div>
                <svg
                  className="transition-all duration-500 rotate-0"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="#212529"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  ></path>
                </svg>
              </div>

              {/* Accordion Content */}
              <div className="accordion-content transition-all duration-500 h-auto">
                <div className="content-wrapper p-10px md:px-30px">
                  <ul>
                    <li className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark">
                      <div>
                        <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                          <i className="icofont-video-alt mr-10px"></i>
                          <span className="font-medium">Video :</span>{" "}
                          {chapter.video?.title || "Untitled Video"}
                        </h4>
                      </div>
                      <div className="text-contentColor dark:text-contentColor-dark text-sm flex">
                        <p>
                          <i className="icofont-clock-time mr-1"></i>
                          {getVideoDuration(chapter)} min
                        </p>
                        {!isAccessible && (
                          <i className="icofont-lock ml-4 text-gray-400"></i>
                        )}
                      </div>
                    </li>

                    {chapter.quiz.length > 0 && (
                      <li className="py-15px flex items-center justify-between flex-wrap">
                        <div>
                          <h4 className={`leading-1 font-light ${
                            !isAccessible ? 'text-gray-400 dark:text-gray-500' : 'text-blackColor dark:text-blackColor-dark'
                          }`}>
                            <i className="icofont-file-text mr-10px"></i>
                            <span className="font-medium">Quiz :</span>{" "}
                            {chapter.title}
                          </h4>
                        </div>
                        <div className={`text-sm flex items-center ${
                          !isAccessible ? 'text-gray-400 dark:text-gray-500' : 'text-blackColor dark:text-blackColor-dark'
                        }`}>
                          <p className="flex items-center">
                            {!isAccessible ? (
                              <i className="icofont-lock mr-1"></i>
                            ) : isQuizPassed ? (
                              <i className="icofont-check-circled text-green-600 mr-1"></i>
                            ) : (
                              <i className="icofont-file-text mr-1"></i>
                            )}
                            {chapter.quiz?.length || 0} Ques
                          </p>
                        </div>
                      </li>
                    )}

                  </ul>
                </div>
              </div>
            </div>
          </li>
          );
        })}

        {/* accordion  */}
        {course?.pdfFiles?.length > 0 && (
          <li className="accordion mb-25px overflow-hidden">
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark">
              {/* controller */}
              <div className="cursor-pointer accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]">
                <div className="flex items-center">
                  <span>Course PDFs</span>
                  <p className="text-xs text-headingColor dark:text-headingColor-dark px-10px py-0.5 ml-10px bg-borderColor dark:bg-borderColor-dark rounded-full">
                    {course.pdfFiles.length} PDF
                    {course.pdfFiles.length > 1 ? "s" : ""}
                  </p>
                </div>
                <svg
                  className="transition-all duration-500 rotate-0"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="#212529"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  ></path>
                </svg>
              </div>

              {/* content */}
              <div className="accordion-content transition-all duration-500">
                <div className="content-wrapper p-10px md:px-30px">
                  <ul>
                    {course.pdfFiles.map((pdf, index) => (
                      <li
                        key={pdf._id}
                        className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark"
                      >
                        <div>
                          <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                            <i className="icofont-file-text mr-10px"></i>
                            <span className="font-medium">
                              PDF {index + 1}:
                            </span>{" "}
                            {pdf.title}
                          </h4>
                        </div>
                        <div className="text-contentColor dark:text-contentColor-dark text-sm flex items-center">
                          <i className="icofont-lock"></i>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        )}

                {/* accordion  */}
                {course?.assignments?.length > 0 && (
          <li className="accordion mb-25px overflow-hidden">
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark">
              {/* controller */}
              <div className="cursor-pointer accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]">
                <div className="flex items-center">
                  <span>Course Assignments</span>
                  <p className="text-xs text-headingColor dark:text-headingColor-dark px-10px py-0.5 ml-10px bg-borderColor dark:bg-borderColor-dark rounded-full">
                    {course.assignments.length} Assign
                    {course.assignments.length > 1 ? "s" : ""}
                  </p>
                </div>
                <svg
                  className="transition-all duration-500 rotate-0"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="#212529"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  ></path>
                </svg>
              </div>

              {/* content */}
              <div className="accordion-content transition-all duration-500">
                <div className="content-wrapper p-10px md:px-30px">
                  <ul>
                    {course.assignments.map((assign, index) => (
                      <li
                        key={index}
                        className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark"
                      >
                        <div>
                          <h4 className="text-blackColor dark:text-blackColor-dark leading-1 font-light">
                            <i className="icofont-file-text mr-10px"></i>
                            <span className="font-medium">
                              Assignment {index + 1}:
                            </span>{" "}
                            {assign}
                          </h4>
                        </div>
                        <div className="text-contentColor dark:text-contentColor-dark text-sm flex items-center">
                          <i className="icofont-lock"></i>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default CurriculumContent;
