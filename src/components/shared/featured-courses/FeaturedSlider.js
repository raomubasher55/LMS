"use client";
import React, { useEffect, useState } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CourseCard from "../courses/CourseCard";
import axios from "axios";

const FeaturedSlider = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/allcourses-about`
        );
        setCourses(data.data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
        setInstructor(null);
      }
    };
  
      fetchCourses();
  }, []);


  const featuredCourses =  courses;

  return (
    <Swiper
      slidesPerView={1}
      grabCursor={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
      breakpoints={{
        576: { slidesPerView: 2 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1500: { slidesPerView: 4 },
      }}
      navigation={true}
      modules={[Autoplay, Navigation]}
      className="featured-courses"
    >
      {featuredCourses.map((course, idx) => (
        console.log(course),
        <SwiperSlide key={idx}>
          <CourseCard type="primary" course={course} instructor={course?.instructor} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FeaturedSlider;
