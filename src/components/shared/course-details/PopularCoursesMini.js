import Image from "next/image";
import courseDetailsImage6 from "@/assets/images/blog-details/blog-details__6.png";
import courseDetailsImage7 from "@/assets/images/blog-details/blog-details__7.png";
import courseDetailsImage8 from "@/assets/images/blog-details/blog-details__8.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import TranslatedText from "../TranslatedText";
// import courseDetailsImage9 from "@/assets/images/blog-details/blog-details__9.png";

const PopularCoursesMini = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/allcourses`, {
            params: {
              limit: 5,
              sort: "-rating" 
            }
          }
        );
        setCourses(data.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching popular courses:", error);
        setLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  return (
    <div
      className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 dark:border-borderColor2-dark"
      data-aos="fade-up"
    >
      <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        <TranslatedText>Cours populaire</TranslatedText>

      </h4>
      {loading ? (
        <div className="p-5"><TranslatedText>Chargement des cours populaires</TranslatedText>...</div>
      ) : !courses.length ? (
        <div className="p-5"><TranslatedText>Aucun cours populaire trouvé</TranslatedText></div>
      ) : (
        <ul className="flex flex-col gap-y-25px">
          {courses.map((course, index) => (
            <li key={course.id || index} className="flex items-center">
              <div className="w-[91px] h-auto mr-5 flex-shrink-0">
                <Link href={`/courses/${course._id}`} className="w-full">
                  <Image
                    src={course.bannerImage ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.bannerImage}` : courseDetailsImage6}
                    alt={course.title || "Course"}
                    width={91}
                    height={91}
                    className="w-full h-full"
                  />
                </Link>
              </div>
              <div className="flex-grow">
                <h3 className="text-sm text-primaryColor font-medium leading-[17px]">
                ${course.discountedPrice || course.price || "00"}
                </h3>
                <Link
                  href={`/courses/${course._id}`}
                  className="text-blackColor dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor font-semibold leading-22px"
                >
                 {(course.title?.split(" ").slice(0, 4).join(" ") || "No Title")}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PopularCoursesMini;
