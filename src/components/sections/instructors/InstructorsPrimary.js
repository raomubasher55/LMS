"use client";
import SectionNameSecondary from "@/components/shared/section-names/SectionNameSecondary";
import InstructorPrimary from "@/components/shared/instructors/InstructorPrimary";
import { useEffect, useState } from "react";
import TranslatedText from "@/components/shared/TranslatedText";
const InstructorsPrimary = () => {
  const [instructors , setInstructors] = useState([]);

const fetchInstructors = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/instructors`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const instructors = await response.json();
        setInstructors(instructors.data);
        
    } catch (error) {
        console.error('Error fetching instructors:', error);
        // Optionally set error state or show notification
    }
};

// Basic useEffect to load on component mount
useEffect(() => {
    fetchInstructors();
}, []);
  return (
    <section>
      <div className="container py-50px md:py-70px lg:py-20 2xl:py-100px  overflow-hidden">
        {/* heading */}

        <div data-aos="fade-up" className="text-center mb-45px">
          <SectionNameSecondary><TranslatedText>ENSEIGNANT EXPERT</TranslatedText></SectionNameSecondary>
          <h3 className="text-3xl md:text-size-35 lg:text-size-45 leading-10 md:leading-2xl font-bold text-blackColor dark:text-blackColor-dark">
            <TranslatedText>Notre enseignant expert</TranslatedText>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-30px gap-y-15">
          {instructors?.map((instrutor, idx) => (
            <InstructorPrimary key={idx} instructor={instrutor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorsPrimary;
