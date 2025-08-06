"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import FooterNavItems from "./FooterNavItems";
import FooterAbout from "./FooterAbout";
import FooterRecentPosts from "./FooterRecentPosts";
import TranslatedText from "@/components/shared/TranslatedText";

const FooterNavList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/allcourses`
        );
        const courses = response.data.data || [];

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            courses
              .map((course) => course.category)
              .filter((category) => category)
          ),
        ];

        setCategories(uniqueCategories);
        setCourses(courses);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const lists = [
    {
      heading: <TranslatedText>Liens utiles</TranslatedText>,
      items: [
        {
          name: <TranslatedText>A propos de nous</TranslatedText>,
          path: "/about",
        },
        {
          name: <TranslatedText>Enseignants</TranslatedText>,
          path: "/instructors",
        },
        {
          name: <TranslatedText>Politique de confidentialite</TranslatedText>,
          path: "/privacy-policy",
        },
        {
          name: <TranslatedText>Histoires de succes</TranslatedText>,
          path: "/success-stories",
        },
      ],
    },
    {
      heading: <TranslatedText>Nos cours</TranslatedText>,
      items: loading
        ? [{ name: "Loading...", path: "#" }]
        : categories.slice(0, 5).map((category) => ({
            name: category,
            path: `/courses?category=${encodeURIComponent(category)}`,
          })),
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-12 md:grid-cols-2 lg:grid-cols-12 gap-30px md:gap-y-5 lg:gap-y-0 pt-60px pb-50px md:pt-30px md:pb-30px lg:pt-110px lg:pb-20">
        {/* left */}
        <FooterAbout />

        {/* nav area */}
        {lists.map((list, idx) => (
          <FooterNavItems key={idx} list={list} idx={idx} />
        ))}

        {/* right */}
        <FooterRecentPosts courses={courses} />
      </div>
    </section>
  );
};

export default FooterNavList;
