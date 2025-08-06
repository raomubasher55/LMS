"use client";

import useTab from "@/hooks/useTab";
import CurriculumContent from "./CurriculumContent";
import DescriptoinContent from "./DescriptoinContent";
import ReviewsContent from "./ReviewsContent";
import InstructorContent from "./InstructorContent";
import CourseTabButton from "../buttons/CourseTabButton";
import TabContentWrapper from "../wrappers/TabContentWrapper";
import { useEffect } from "react";
import TranslatedText from "../TranslatedText";

const CourseDetailsTab = ({ type, course, progressData }) => {
  const { currentIdx, setCurrentIdx, handleTabClick } = useTab();
  const tabButtons = [
    {
      name: (
        <>
          <i className="icofont-book-alt mr-2"></i> <TranslatedText>Programme</TranslatedText>

        </>
      ),
      content: <CurriculumContent course={course} progressData={progressData} />,
    },
    {
      name: (
        <>
          {" "}
          <i className="icofont-paper mr-2"></i> <TranslatedText>Avantages</TranslatedText>
        </>
      ),
      content: <DescriptoinContent course={course} />,
    },
    {
      name: (
        <>
          <i className="icofont-star mr-2"></i> <TranslatedText>Avis</TranslatedText>

        </>
      ),
      content: <ReviewsContent course={course} />,
    },
    {
      name: (
        <>
          <i className="icofont-teacher mr-2"></i> <TranslatedText>Formateur</TranslatedText>
        </>
      ),
      content: <InstructorContent id={course?.instructor._id} />,
    },
  ];
  useEffect(() => {
    if (type === 2) {
      setCurrentIdx(1);
    }
    if (type === 3) {
      setCurrentIdx(2);
    }
  }, [, type, setCurrentIdx]);
  return (
    <div data-aos="fade-up" className="tab course-details-tab">
      <div className="tab-links flex flex-wrap md:flex-nowrap mb-30px rounded gap-0.5">
        {tabButtons?.map(({ name }, idx) => (
          <CourseTabButton
            key={idx}
            idx={idx}
            currentIdx={currentIdx}
            handleTabClick={handleTabClick}
          >
            {name}
          </CourseTabButton>
        ))}
      </div>

      <div className="tab-contents">
        {tabButtons?.map(({ content }, idx) => (
          <TabContentWrapper
            key={idx}
            isShow={currentIdx === idx ? true : false}
          >
            {content}
          </TabContentWrapper>
        ))}
      </div>
    </div>
  );
};

export default CourseDetailsTab;
