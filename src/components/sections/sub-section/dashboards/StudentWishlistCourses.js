"use client";
import { useState, useEffect } from "react";
import { useWishlistContext } from "@/contexts/WshlistContext";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import useSweetAlert from "@/hooks/useSweetAlert";
import TranslatedText from "@/components/shared/TranslatedText";

const StudentWishlistCourses = () => {
  const { wishlistProducts, deleteProductFromWishlist } = useWishlistContext();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const createAlert = useSweetAlert();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!wishlistProducts || wishlistProducts.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Get course details for each wishlist item
        const coursePromises = wishlistProducts.map(item => 
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${item.courseId}`)
        );
        
        const responses = await Promise.all(coursePromises);
        const coursesData = responses.map(res => res.data);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching course details:", error);
        createAlert("error", "Failed to load wishlist courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [wishlistProducts]);

  const handleRemoveFromWishlist = async (courseId) => {
    await deleteProductFromWishlist(courseId);
  };

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
            <TranslatedText>Ma Liste de Souhaits</TranslatedText>
          </h2>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          <TranslatedText>Ma Liste de Souhaits</TranslatedText>
        </h2>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-4"><TranslatedText>Votre liste de souhaits est vide</TranslatedText></p>
          <Link href="/courses" className="bg-primaryColor hover:bg-primaryColor/90 text-white px-4 py-2 rounded">
            <TranslatedText>Parcourir les Cours</TranslatedText>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="border dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {/* Course Image */}
              <div className="relative w-full h-40">
                <Image
                  src={course.bannerImage || "/placeholder.jpg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Course Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-secondaryColor/10 text-secondaryColor dark:text-secondaryColor-dark py-1 px-2 inline-block rounded">
                    {course.category}
                  </span>
                  <button
                    onClick={() => handleRemoveFromWishlist(course._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>

                <Link href={`/courses/${course._id}`}>
                  <h3 className="font-bold text-lg mb-2 hover:text-primaryColor transition-colors">
                    {course.title}
                  </h3>
                </Link>

                {/* Instructor */}
                {course.instructor && (
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative mr-2">
                      <Image
                        src={course.instructor.profile || "/default-avatar.png"}
                        alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                        width={32}
                        height={32}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="text-sm">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex justify-between items-center mt-4">
                  <div>
                    {course.discountedPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primaryColor">${course.discountedPrice}</span>
                        <span className="text-gray-500 dark:text-gray-400 line-through text-sm">${course.price}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-primaryColor">${course.price}</span>
                    )}
                  </div>

                  <Link 
                    href={`/courses/${course._id}`} 
                    className="text-sm bg-primaryColor hover:bg-primaryColor/90 text-white px-3 py-1.5 rounded"
                  >
                    <TranslatedText>Voir le Cours</TranslatedText>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentWishlistCourses;