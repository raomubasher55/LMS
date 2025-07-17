import React from "react";

const DescriptoinContent = ({ course }) => {
  const benefitsList = course?.benefits?.split("\r\n").filter(Boolean);
  const requirementsList = course?.requirements?.split("\r\n").filter(Boolean);

  return (
    <div className="space-y-8 mb-10 border-b border-primary">
      {/* Benefits Section */}
      <div 
        data-aos="fade-up" 
        className="border-t-4 border-primary bg-lightGray p-6 rounded-lg"
      >
        <h4 className="text-size-26 font-bold text-blackColor dark:text-blackColor-dark mb-4 leading-tight">
          What You Will Learn
        </h4>
        <ul className="list-disc pl-6 text-lg text-darkdeep4 leading-8 space-y-2">
          {benefitsList?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Description */}
      <div 
        data-aos="fade-up" 
        className="border-t-4 border-primary bg-lightGray p-6 rounded-lg"
      >
        <h4 className="text-size-26 font-bold text-blackColor dark:text-blackColor-dark mb-4 leading-tight">
          Course Overview
        </h4>
        <p className="text-lg text-darkdeep4 leading-30px whitespace-pre-line">
          {course?.description}
        </p>
      </div>

      {/* Requirements Section */}
      <div 
        data-aos="fade-up" 
        className="border-t-4 border-primary bg-lightGray p-6 rounded-lg"
      >
        <h4 className="text-size-26 font-bold text-blackColor dark:text-blackColor-dark mb-4 leading-tight">
          Requirements
        </h4>
        <ul className="list-disc pl-6 text-lg text-darkdeep4 leading-8 space-y-2">
          {requirementsList?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DescriptoinContent;
