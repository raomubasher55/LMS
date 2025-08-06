"use client";

import accordions from "@/libs/accordions";
import Link from "next/link";
import { useEffect } from "react";
import TranslatedText from "../TranslatedText";

const CurriculumContent = ({ course, progressData }) => {
  useEffect(() => {
    accordions();
  }, []);

  // Helper function to get video duration
  const getVideoDuration = (lesson) => {
    const duration = lesson.video?.duration;

    if (!duration || isNaN(duration) || duration <= 0) {
      return "N/A";
    }

    // Convert seconds to minutes
    const minutes = Math.floor(duration / 60);

    // If less than 1 minute, show "< 1"
    if (minutes < 1 && duration > 0) {
      return "< 1";
    }

    return minutes.toString();
  };

  const isLessonQuizPassed = (lessonId) => {
    if (!progressData?.quizProgress || !course?._id) {
      return false;
    }

    const quizAttempt = progressData.quizProgress.find(
      (quiz) =>
        quiz.lessonId &&
        quiz.lessonId.toString() === lessonId.toString() &&
        quiz.courseId &&
        quiz.courseId.toString() === course._id.toString()
    );

    return (
      quizAttempt &&
      (quizAttempt.passed ||
        (quizAttempt.bestScore && quizAttempt.bestScore >= 60))
    );
  };

  const isLessonAccessible = (chapterIndex, lessonIndex) => {
    // First lesson is always accessible
    if (chapterIndex === 0 && lessonIndex === 0) return true;

    // For subsequent lessons, check if previous lesson's quiz was passed if required
    const chapter = course?.chapters?.[chapterIndex];
    const lesson = chapter?.lessons?.[lessonIndex];

    if (!chapter?.isLockedUntilQuizPass) {
      return true;
    }

    // Check previous lesson in same chapter
    if (lessonIndex > 0) {
      const prevLesson = chapter.lessons[lessonIndex - 1];
      if (prevLesson.quiz) {
        return isLessonQuizPassed(prevLesson._id);
      }
      return true;
    }

    // If first lesson in chapter, check last lesson of previous chapter
    if (chapterIndex > 0) {
      const prevChapter = course.chapters[chapterIndex - 1];
      const lastLesson = prevChapter.lessons[prevChapter.lessons.length - 1];
      if (lastLesson.quiz) {
        return isLessonQuizPassed(lastLesson._id);
      }
      return true;
    }

    return true;
  };

  return (
    <div>
      <ul className="accordion-container curriculum">
        {/* Chapters Accordion */}
        {course?.chapters?.map((chapter, chapterIndex) => (
          <li key={chapter._id} className="accordion mb-25px overflow-hidden">
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark rounded-md">
              {/* Chapter Header */}
              <div className="cursor-pointer accordion-controller flex justify-between items-center text-xl font-bold w-full px-5 py-18px font-hind leading-[20px] text-headingColor dark:text-headingColor-dark">
                <div className="flex items-center">
                  <span>{chapter.title}</span>
                  <p className="text-xs px-10px py-0.5 ml-10px rounded-full text-headingColor dark:text-headingColor-dark bg-borderColor dark:bg-borderColor-dark">
                    {chapter.lessons?.length || 0}{" "}
                    <TranslatedText>Leçon</TranslatedText>
                    {chapter.lessons?.length !== 1 ? "s" : ""}
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

              {/* Chapter Content */}
              <div className="accordion-content transition-all duration-500 h-auto">
                <div className="content-wrapper p-10px md:px-30px">
                  <ul>
                    {chapter.lessons?.map((lesson, lessonIndex) => {
                      const isAccessible = isLessonAccessible(
                        chapterIndex,
                        lessonIndex
                      );
                      const isQuizPassed =
                        lesson.quiz && isLessonQuizPassed(lesson._id);

                      return (
                        <li
                          key={lesson._id}
                          className="py-4 flex items-center justify-between flex-wrap border-b border-borderColor dark:border-borderColor-dark"
                        >
                          <div>
                            <h4
                              className={`leading-1 font-light ${
                                !isAccessible
                                  ? "text-gray-400 dark:text-gray-500"
                                  : "text-blackColor dark:text-blackColor-dark"
                              }`}
                            >
                              <i className="icofont-video-alt mr-10px"></i>
                              <span className="font-medium">
                                <TranslatedText>Leçon</TranslatedText>{" "}
                                {lessonIndex + 1}:
                              </span>{" "}
                              {lesson.title}
                            </h4>
                          </div>
                          <div
                            className={`text-sm flex items-center ${
                              !isAccessible
                                ? "text-gray-400 dark:text-gray-500"
                                : "text-contentColor dark:text-contentColor-dark"
                            }`}
                          >
                            {lesson.video && (
                              <p className="mr-4">
                                <i className="icofont-clock-time mr-1"></i>
                                {getVideoDuration(lesson)} min
                              </p>
                            )}
                            {!isAccessible && <i className="icofont-lock"></i>}
                            {lesson.quiz && isAccessible && (
                              <span className="text-xs bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                                {isQuizPassed ? (
                                  <TranslatedText>Quiz réussi</TranslatedText>
                                ) : (
                                  <TranslatedText>Quiz</TranslatedText>
                                )}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        ))}

        {/* PDF Files Accordion */}
        {course?.pdfFiles?.length > 0 && (
          <li className="accordion mb-25px overflow-hidden">
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark">
              {/* controller */}
              <div className="cursor-pointer accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]">
                <div className="flex items-center">
                  <span>
                    <TranslatedText>PDF du cours</TranslatedText>
                  </span>
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
                        key={pdf._id || index}
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

        {/* Assignments Accordion */}
        {course?.assignments?.length > 0 && (
          <li className="accordion mb-25px overflow-hidden">
            <div className="bg-whiteColor border border-borderColor dark:bg-whiteColor-dark dark:border-borderColor-dark">
              {/* controller */}
              <div className="cursor-pointer accordion-controller flex justify-between items-center text-xl text-headingColor font-bold w-full px-5 py-18px dark:text-headingColor-dark font-hind leading-[20px]">
                <div className="flex items-center">
                  <span>
                    <TranslatedText>Devoirs du cours</TranslatedText>
                  </span>
                  <p className="text-xs text-headingColor dark:text-headingColor-dark px-10px py-0.5 ml-10px bg-borderColor dark:bg-borderColor-dark rounded-full">
                    {course.assignments.length}{" "}
                    <TranslatedText>Devoir</TranslatedText>
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
                              <TranslatedText>Devoir</TranslatedText>{" "}
                              {index + 1}:
                            </span>{" "}
                            {assign.title || `Devoir ${index + 1}`}
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
