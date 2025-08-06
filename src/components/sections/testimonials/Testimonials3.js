"use client";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";
import Image from "next/image";
import Link from "next/link";
import aboutImage4 from "@/assets/images/about/about_4.png";
import FeaturedSlider from "@/components/shared/featured-courses/FeaturedSlider";
import { useEffect, useState } from "react";

const Testimonials3 = ({ isInsTructorDetails, id }) => {
  const [Instructor, setInstructor] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/instructors/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch instructor");
        const data = await res.json();
        setInstructor(data.data);
      } catch (error) {
        console.error("Error fetching instructor:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!Instructor) return null;

  const {
    firstName,
    lastName,
    skill,
    bio,
    profile,
    instructorProfile,
  } = Instructor;

   const socialLinks = instructorProfile?.socialLinks;

   console.log(Instructor)
  return (
    <section
      className={`${
        isInsTructorDetails
          ? "pt-70px pb-100px"
          : "py-50px md:py-70px lg:py-20 2xl:pt-0 2xl:pb-50px"
      }`}
    >
      <div
        className={
          isInsTructorDetails
            ? ""
            : "py-10 md:py-10 2xl:py-50px 3xl:py-30 mx-10px md:mx-50px 3xl:mx-150px bg-darkdeep3 dark:bg-darkdeep3-dark shadow-container rounded-5"
        }
      >
        <div className="container">
          {/* about section  */}
          <div className="grid grid-cols-1 lg:grid-cols-12 pt-30px gap-x-30px">
            {/* about left */}
            <div
              className="lg:col-start-1 lg:col-span-4 relative z-0 mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 overflow-visible"
              data-aos="fade-up"
            >
              <TiltWrapper>
                <div className="tilt relative">
                  {profile && (
                    <Image
                      src={profile 
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${profile}`
                        : '/placeholder-user.jpg'}
                      width={400}
                      height={400}
                      alt={firstName}
                      className="w-full rounded-2xl"
                    />
                  )}
                  <Image
                    className="absolute top-0 left-[-30px] animate-move-hor z-[-1]"
                    src={aboutImage4}
                    alt=""
                  />
                </div>
              </TiltWrapper>
            </div>

            {/* about right */}
            <div data-aos="fade-up" className="lg:col-start-5 lg:col-span-8">
              <div className="flex justify-between items-center flex-wrap md:flex-nowrap gap-5">
                <div>
                  <h3 className="text-size-25 md:text-size-40 font-bold text-blackColor dark:text-blackColor-dark">
                    {firstName + " " + lastName}
                  </h3>
                  <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark">
                    Teaches: {skill}
                  </p>
                </div>

                {/* <div>
                  <p className="text-blackColor dark:text-blackColor-dark">
                    Review:
                  </p>
                  <div>
                    <i className="icofont-star text-yellow"></i>
                    <i className="icofont-star text-yellow"></i>
                    <i className="icofont-star text-yellow"></i>
                    <i className="icofont-star text-yellow"></i>
                    <i className="icofont-star text-yellow"></i>
                    <span className="text-xs text-lightGrey6">(44)</span>
                  </div>
                </div> */}

                <div>
                  <p className="text-blackColor dark:text-blackColor-dark">
                    Follow Me:
                  </p>
                  <ul className="flex gap-13px text-base text-contentColor dark:text-contentColor-dark">
                    {socialLinks.facebook && (
                      <li>
                        <Link
                          className="hover:text-primaryColor"
                          href={socialLinks.facebook}
                          target="_blank"
                        >
                          <i className="icofont-facebook"></i>
                        </Link>
                      </li>
                    )}
                    {socialLinks.twitter && (
                      <li>
                        <Link
                          className="hover:text-primaryColor"
                          href={socialLinks.twitter}
                          target="_blank"
                        >
                          <i className="icofont-twitter"></i>
                        </Link>
                      </li>
                    )}
                    {socialLinks.linkedin && (
                      <li>
                        <Link
                          className="hover:text-primaryColor"
                          href={socialLinks.linkedin}
                          target="_blank"
                        >
                          <i className="icofont-linkedin"></i>
                        </Link>
                      </li>
                    )}
                    {socialLinks.github && (
                      <li>
                        <Link
                          className="hover:text-primaryColor"
                          href={socialLinks.github}
                          target="_blank"
                        >
                          <i className="icofont-github"></i>
                        </Link>
                      </li>
                    )}
                    {socialLinks.website && (
                      <li>
                        <Link
                          className="hover:text-primaryColor"
                          href={`https://${socialLinks.website}`}
                          target="_blank"
                        >
                          <i className="icofont-globe"></i>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
{/* 
                <div>
                  <Link
                    href="#"
                    className="text-sm md:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor px-10 py-10px hover:text-primaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                  >
                    Follow
                  </Link>
                </div> */}
              </div>

              {/* Bio Section */}
              <div className="pt-7 mt-30px border-t border-borderColor dark:border-borderColor-dark">
                <h4 className="text-xl text-blackColor dark:text-blackColor-dark font-semibold mb-1">
                  Short Bio
                </h4>
                <p className="leading-7 text-contentColor dark:text-contentColor-dark">
                  {bio || "No bio available for this instructor."}
                </p>
              </div>

              {/* Featured Courses */}
              {isInsTructorDetails && (
                <>
                  <div className="mb-10px mt-10">
                    <h4 className="text-3xl font-bold text-blackColor dark:text-blackColor-dark leading-1.2">
                      Online Courses
                    </h4>
                  </div>
                  <div className="-mx-15px">
                    <FeaturedSlider instructorId={Instructor._id} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials3;
