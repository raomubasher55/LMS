"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import TestimonialSlide from "./TestimonialSlide";
import { UserIcon } from "lucide-react"; // SVG icon from lucide-react

const TestimonialsSlider = () => {
  const testimonials = [
    {
      name: "Amina Yusuf",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Web Development Student",
      desc: "Tanga Academie transformed my career. The HTML and CSS course gave me real-world skills and the confidence to build websites on my own.",
    },
    {
      name: "John Mwakalukwa",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Freelancer & Alumni",
      desc: "The hands-on projects and expert guidance helped me land my first freelance gig. Highly recommend it to anyone serious about coding.",
    },
    {
      name: "Rehema Mushi",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Beginner Developer",
      desc: "I started with no coding background, but now I build responsive websites confidently thanks to their step-by-step tutorials.",
    },
    {
      name: "Elisha Mndeme",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "UI/UX Designer",
      desc: "Tanga Academie’s CSS module helped me master Flexbox and Grid. Perfect for designers who want frontend skills.",
    },
    {
      name: "Fatma Ally",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Full-Stack Enthusiast",
      desc: "The structure and support at Tanga Academie are top-notch. I now have a strong foundation in web development.",
    },
    {
      name: "Samuel Mbwana",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "IT Graduate",
      desc: "I joined to refresh my skills. Ended up learning modern development tools I never used in college.",
    },
    {
      name: "Neema Joseph",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Freelance Designer",
      desc: "Courses are clear, beginner-friendly, and practical. I use what I learned every day in my freelance work.",
    },
    {
      name: "Juma Said",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Software Trainee",
      desc: "Tanga Academie helped me finally understand JavaScript. I now build interactive web apps confidently.",
    },
    {
      name: "Lucy Matonya",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "College Student",
      desc: "I joined during holidays and learned more practical skills than I did in my entire first year at college.",
    },
    {
      name: "Hamis Rajabu",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Aspiring Developer",
      desc: "Their focus on project-based learning makes a real difference. You finish with real work in your portfolio.",
    },
    {
      name: "Angela Nyangusi",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Graphic Designer",
      desc: "The frontend courses helped me bridge the gap between design and development. Highly recommend.",
    },
    {
      name: "George Paul",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Frontend Developer",
      desc: "I improved my skills and got a remote job thanks to what I learned from Tanga Academie.",
    },
    {
      name: "Ruth Mbaga",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "WordPress Developer",
      desc: "The HTML/CSS deep dives improved my WordPress themes drastically. Clean, modern code.",
    },
    {
      name: "Salim Athumani",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "Self-Taught Dev",
      desc: "I finally found a structured learning path at Tanga Academie. No fluff, just what matters.",
    },
    {
      name: "Mariam Juma",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "UI Intern",
      desc: "Thanks to their mentorship, I got an internship as a UI developer. The feedback was priceless.",
    },
    {
      name: "Noel Christopher",
      icon: <UserIcon className="w-12 h-12 text-primary dark:text-white" />,
      desig: "High School Student",
      desc: "Learning at Tanga Academie was my first coding experience. Now I want to become a software engineer.",
    },
  ];

  return (
    <Swiper
      className="mySwiper"
      slidesPerView={1}
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      loop={true}
      navigation={true}
      modules={[Navigation]}
    >
      {testimonials.map((testimonial, idx) => (
        <SwiperSlide key={idx}>
          <TestimonialSlide testimonial={testimonial} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TestimonialsSlider;
