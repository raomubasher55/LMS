"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import FilterController from "@/components/shared/courses/FilterController";
import HeadingPrimaryXl from "@/components/shared/headings/HeadingPrimaryXl ";
import SectionName from "@/components/shared/section-names/SectionName";
import FilterControllerWrapper from "@/components/shared/wrappers/FilterControllerWrapper";
import FilterCards from "@/components/shared/courses/FilterCards";
import TranslatedText from "@/components/shared/TranslatedText";

const CoursesFilter = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/allcourses`);
        const coursesData = res.data.data || [];
        setCourses(coursesData);
        
        // Calculate category counts
        const categoryCounts = {};
        coursesData.forEach(course => {
          if (course.category) {
            categoryCounts[course.category] = (categoryCounts[course.category] || 0) + 1;
          }
        });

        // Sort categories by count (descending) and take top 4
        const sortedCategories = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([category]) => category);

        setCategories(sortedCategories);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses =
    selectedCategory === "all"
      ? courses
      : courses.filter(course => 
          course.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <section>
      <div className="h-[900px] pt-50px pb-10 md:pt-70px md:pb-50px lg:pt-20 2xl:pt-100px 2xl:pb-70px bg-whiteColor dark:bg-whiteColor-dark overflow-hidden">
        <div className="filter-container container">
          <div className="flex gap-15px lg:gap-30px flex-wrap lg:flex-nowrap items-center">
            {/* courses Left */}
            <div className="basis-full lg:basis-[500px]" data-aos="fade-up">
              <SectionName><TranslatedText>Liste des cours</TranslatedText></SectionName>
              <HeadingPrimaryXl>
                <TranslatedText>
                  Le cours en ligne parfait <br className="hidden lg:block" />
                  pour votre carrière
                </TranslatedText>
              </HeadingPrimaryXl>
            </div>

            {/* courses right */}
              <FilterController 
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory} 
              />
          </div>

          {/* Course Cards */}
          <FilterCards courses={filteredCourses} loading={loading} />
        </div>
      </div>
    </section>
  );
};

export default CoursesFilter;