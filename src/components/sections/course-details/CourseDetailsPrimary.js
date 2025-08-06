"use client";
import CourseDetailsSidebar from "@/components/shared/courses/CourseDetailsSidebar";
import Image from "next/image";
import BlogTagsAndSocila from "@/components/shared/blog-details/BlogTagsAndSocila";
import ClientComment from "@/components/shared/blog-details/ClientComment";
import CommentFome from "@/components/shared/forms/CommentFome";
import CourseDetailsTab from "@/components/shared/course-details/CourseDetailsTab";
import InstrutorOtherCourses from "@/components/shared/course-details/InstrutorOtherCourses";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import TranslatedText from "@/components/shared/TranslatedText";
const CourseDetailsPrimary = ({ id: courseId, type }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${courseId}`
        );
        setCourse(response.data.course);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch course:", error);
        setLoading(false);
      }
    };

    const fetchCourseProgress = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/progress/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setProgressData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching course progress:", error);
      }
    };

    if (courseId) {
      fetchCourse();
      fetchCourseProgress();
    }
  }, [courseId]);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!course) {
    return <p>Course not found!</p>;
  }
  const {
    title,
    price,
    discountedPrice,
    description,
    instructor,
    category,
    bannerImage,
    createdAt,
    language,
    status,
    tags,
    totalDuration,
    chapters,
  } = course;

  function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }

  return (
    <section>
      <div className="container py-10 md:py-50px lg:py-60px 2xl:py-100px">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
          <div className="lg:col-start-1 lg:col-span-8 space-y-[35px]">
            {/* course 1  */}
            <div data-aos="fade-up">
              {/* course thumbnail  */}

              {bannerImage && (
                <div className="overflow-hidden relative mb-5">
                  <Image
                    src={
                      bannerImage
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${bannerImage}`
                        : "/placeholder-course.jpg"
                    }
                    alt=""
                    width={400}
                    height={225}
                    className="w-full"
                  />
                </div>
              )}

              {/* course content  */}
              <div>
                <>
                  <div
                    className="flex items-center justify-between flex-wrap gap-6 mb-30px"
                    data-aos="fade-up"
                  >
                    <div className="flex items-center gap-6">
                      <button className="text-sm text-whiteColor bg-primaryColor border border-primaryColor px-26px py-0.5 leading-23px font-semibold hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor">
                        <TranslatedText>En vedette</TranslatedText>
                      </button>
                      <button className="text-sm text-whiteColor bg-indigo border border-indigo px-22px py-0.5 leading-23px font-semibold hover:text-indigo hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-indigo">
                        {category}
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-contentColor dark:text-contentColor-dark font-medium">
                        <TranslatedText>Dernière mise à jour</TranslatedText>:{" "}
                        <span className="text-blackColor dark:text-blackColor-dark">
                          {moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* titile  */}
                  <h4
                    className="text-size-32 md:text-4xl font-bold text-blackColor dark:text-blackColor-dark mb-15px leading-43px md:leading-14.5"
                    data-aos="fade-up"
                  >
                    {title || (
                      <TranslatedText>
                        Faire de la musique avec d'autres personnes
                      </TranslatedText>
                    )}
                  </h4>
                  {/* price and rating  */}
                  <div
                    className="flex gap-5 flex-wrap items-center mb-30px"
                    data-aos="fade-up"
                  >
                    <div className="text-size-21 font-medium text-primaryColor font-inter leading-25px">
                      {discountedPrice ? (
                        <>
                          ${discountedPrice?.toFixed(2)}{" "}
                          <del className="text-sm text-lightGrey4 font-semibold">
                            / ${price?.toFixed(2)}
                          </del>
                        </>
                      ) : (
                        `$${price?.toFixed(2)}`
                      )}
                    </div>

                    <div className="flex items-center">
                      <div>
                        <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                      </div>
                      <div>
                        <span className=" text-black dark:text-blackColor-dark">
                          {chapters?.length > 0 ? chapters?.length : "0"}{" "}
                          <TranslatedText>Leçons</TranslatedText>
                        </span>
                      </div>
                    </div>
                    <div className="text-start md:text-end">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`icofont-star text-size-15 ${
                            star <= (course.rating || 0)
                              ? "text-[#F59E0B]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-blackColor dark:text-blackColor-dark">
                        ({course.totalReviews || 0})
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-sm md:text-lg text-contentColor dark:contentColor-dark mb-25px !leading-30px"
                    data-aos="fade-up"
                  >
                    {description}
                  </p>
                  {/* details  */}
                  <div>
                    <h4
                      className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px"
                      data-aos="fade-up"
                    >
                      <TranslatedText>Détails du cours</TranslatedText>
                    </h4>

                    <div
                      className="bg-darkdeep3 dark:bg-darkdeep3-dark mb-30px grid grid-cols-1 md:grid-cols-2"
                      data-aos="fade-up"
                    >
                      <ul className="p-10px md:py-55px md:pl-50px md:pr-70px lg:py-35px lg:px-30px 2xl:py-55px 2xl:pl-50px 2xl:pr-70px border-r-2 border-borderColor dark:border-borderColor-dark space-y-[10px]">
                        <li>
                          <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                            <TranslatedText>Formateur</TranslatedText> :
                            <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                              {instructor?.firstName +
                                " " +
                                instructor?.lastName || "Zahid Ghotia"}
                            </span>
                          </p>
                        </li>
                        <li>
                          <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                            <TranslatedText>Conférences</TranslatedText> :
                            <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                              {chapters?.length > 0 ? chapters?.length : "0"}{" "}
                              sub
                            </span>
                          </p>
                        </li>
                        <li>
                          <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                            <TranslatedText>Durée</TranslatedText> :
                            <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                              {formatDuration(totalDuration)}
                            </span>
                          </p>
                        </li>
                        <li>
                          <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                            <TranslatedText>Inscrit</TranslatedText> :
                            <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                              {course?.enrolled ? course?.enrolled : "0"}{" "}
                              <TranslatedText>Étudiants</TranslatedText>
                            </span>
                          </p>
                        </li>
                      </ul>
                      <ul className="p-10px md:py-55px md:pl-50px md:pr-70px lg:py-35px lg:px-30px 2xl:py-55px 2xl:pl-50px 2xl:pr-70px border-r-2 border-borderColor dark:border-borderColor-dark space-y-[10px]">
                        <li>
                          <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                            <TranslatedText>Langue</TranslatedText> :
                            <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                              {language}
                            </span>
                          </p>
                        </li>
                        <li>
                          <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                            <TranslatedText>Remise sur le prix</TranslatedText>{" "}
                            :
                            <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                              ${discountedPrice}
                            </span>
                          </p>
                        </li>
                        <li>
                          <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                            <TranslatedText>Prix habituel</TranslatedText> :
                            <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                              ${price}
                            </span>
                          </p>
                        </li>
                        <li>
                          <p className="text-contentColor2 dark:text-contentColor2-dark flex justify-between items-center">
                            <TranslatedText>
                              Statut du cours&nbsp;:
                            </TranslatedText>

                            <span className="text-base lg:text-sm 2xl:text-base text-blackColor dark:text-deepgreen-dark font-medium text-opacity-100">
                              {status === "published" ? (
                                <TranslatedText>Disponible</TranslatedText>
                              ) : (
                                <TranslatedText>Non disponible</TranslatedText>
                              )}
                            </span>
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>

                {/* course tab  */}
                <CourseDetailsTab
                  course={course}
                  type={type}
                  progressData={progressData}
                />

                <div className="md:col-start-5 md:col-span-8 mb-5">
                  <h4
                    className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-15px !leading-38px"
                    data-aos="fade-up"
                  >
                    <TranslatedText>
                      Pourquoi choisir ce cours sur Tanga Académie&nbsp;?
                    </TranslatedText>
                  </h4>
                  <ul className="space-y-[15px] max-w-127">
                    <li className="flex items-center group" data-aos="fade-up">
                      <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                      <p className="text-sm lg:text-xs 2xl:text-sm font-medium leading-25px lg:leading-21px 2xl:leading-25px text-contentColor dark:text-contentColor-dark">
                        <strong>Vidéos dirigées par des experts:</strong>{" "}
                        Apprenez auprès de professionnels du secteur grâce à des
                        tutoriels étape par étape.
                      </p>
                    </li>
                    <li className="flex items-center group" data-aos="fade-up">
                      <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                      <p className="text-sm lg:text-xs 2xl:text-sm font-medium leading-25px lg:leading-21px 2xl:leading-25px text-contentColor dark:text-contentColor-dark">
                        <strong>Ressources téléchargeables:</strong> Accédez à
                        des PDF, des fiches pratiques et des modèles pour un
                        apprentissage hors ligne.
                      </p>
                    </li>
                    <li className="flex items-center group" data-aos="fade-up">
                      <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                      <p className="text-sm lg:text-xs 2xl:text-sm font-medium leading-25px lg:leading-21px 2xl:leading-25px text-contentColor dark:text-contentColor-dark">
                        <strong>Soutien communautaire:</strong> Obtenez des
                        réponses à vos questions via les forums de discussion de
                        Tanga Académie.
                      </p>
                    </li>
                    <li className="flex items-center group" data-aos="fade-up">
                      <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                      <p className="text-sm lg:text-xs 2xl:text-sm font-medium leading-25px lg:leading-21px 2xl:leading-25px text-contentColor dark:text-contentColor-dark">
                        <strong>Certificat de réussite:</strong> Obtenez une
                        certification de Tanga Académie pour valoriser vos
                        compétences.
                      </p>
                    </li>
                  </ul>
                </div>
                {/* tag and share   */}

                <BlogTagsAndSocila tags={tags} courseId={courseId} />
                {/* other courses  */}
                <InstrutorOtherCourses instructorId={course?.instructor?._id} />
                {/* previous comment area  */}
                <ClientComment courseId={courseId} />
                {/* write comment area  */}
                <CommentFome courseId={courseId} />
              </div>
            </div>
          </div>
          {/* course sidebar  */}
          <div className={`lg:col-start-9 lg:col-span-4`}>
            <CourseDetailsSidebar type={type} course={course} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetailsPrimary;
