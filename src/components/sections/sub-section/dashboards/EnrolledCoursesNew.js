"use client";
import { useState } from "react";
import useTab from "@/hooks/useTab";
import useEnrolledCourses from "@/hooks/useEnrolledCourses";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import TabButtonSecondary from "@/components/shared/buttons/TabButtonSecondary";
import CourseProgressCard from "@/components/shared/courses/CourseProgressCard";
import { toast } from "react-toastify";
import TranslatedText from "@/components/shared/TranslatedText";

const EnrolledCoursesNew = () => {
  const { currentIdx, handleTabClick } = useTab();
  const { 
    enrolledCourses, 
    loading, 
    error, 
    updateCourseProgress, 
    markCourseAsCompleted, 
    refetch 
  } = useEnrolledCourses();

  const handleMarkCompleted = async (courseId) => {
    const success = await markCourseAsCompleted(courseId);
    if (success) {
      toast.success("Course marked as completed!");
    }
  };

  const tabbuttons = [
    {
      name: <TranslatedText>TOUS LES COURS</TranslatedText>,
      content: (
        loading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
          </div>
        ) : enrolledCourses.all.length > 0 ? (
          enrolledCourses.all.map((course) => (
            <div key={course._id} className="sm:px-15px mb-30px">
              <CourseProgressCard 
                course={course} 
                onMarkCompleted={handleMarkCompleted}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-500 dark:text-gray-400"><TranslatedText>Vous ne vous êtes inscrit à aucun cours pour le moment</TranslatedText>.</p>
            <a href="/courses" className="inline-block mt-4 bg-primaryColor hover:bg-primaryColor/90 text-white px-4 py-2 rounded-md">
              <TranslatedText>Parcourir les Cours</TranslatedText>
            </a>
          </div>
        )
      ),
    },
    {
      name: <TranslatedText>COURS ACTIFS</TranslatedText>,
      content: (
        loading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
          </div>
        ) : enrolledCourses.active.length > 0 ? (
          enrolledCourses.active.map((course) => (
            <div key={course._id} className="sm:px-15px mb-30px">
              <CourseProgressCard 
                course={course} 
                onMarkCompleted={handleMarkCompleted}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-500 dark:text-gray-400"><TranslatedText>Vous n'avez aucun cours actif</TranslatedText>.</p>
          </div>
        )
      ),
    },
    {
      name: <TranslatedText>COURS TERMINÉS</TranslatedText>,
      content: (
        loading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
          </div>
        ) : enrolledCourses.completed.length > 0 ? (
          enrolledCourses.completed.map((course) => (
            <div key={course._id} className="sm:px-15px mb-30px">
              <CourseProgressCard 
                course={course} 
                onMarkCompleted={handleMarkCompleted}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-500 dark:text-gray-400"><TranslatedText>Vous n'avez terminé aucun cours pour le moment</TranslatedText>.</p>
          </div>
        )
      ),
    },
  ];

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      {/* heading  */}
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          <TranslatedText>Mes Cours</TranslatedText>
        </h2>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error?.message || String(error)}</span>
        </div>
      )}
      
      <div className="tab">
        <div className="tab-links flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
          {tabbuttons?.map(({ name }, idx) => (
            <TabButtonSecondary
              key={idx}
              name={name}
              idx={idx}
              currentIdx={currentIdx}
              handleTabClick={handleTabClick}
              button={"small"}
            />
          ))}
        </div>
        <div>
          {tabbuttons?.map(({ content }, idx) => (
            <TabContentWrapper
              key={idx}
              isShow={idx === currentIdx ? true : false}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:-mx-15px ">
                {content}
              </div>
            </TabContentWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnrolledCoursesNew;