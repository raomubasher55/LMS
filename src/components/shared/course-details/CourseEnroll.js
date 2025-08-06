"use client";
import Image from "next/image";
import PopupVideo from "../popup/PopupVideo";
import blogImage7 from "@/assets/images/blog/blog_7.png";
import { useCartContext } from "@/contexts/CartContext";

const CourseEnroll = ({ type, course }) => {
  const { addProductToCart } = useCartContext();
  const {} = course;
  const image = course?.bannerImage 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.bannerImage}`
    : '/placeholder-course.jpg';

  const getTotalDuration = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  return (
    <div
      className="py-33px px-25px shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark rounded-md"
      data-aos="fade-up"
    >
      <div className="overflow-hidden relative mb-5">
        <Image
          src={
            course?.bannerImage 
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.bannerImage}`
              : blogImage7
          }
          alt="course image"
          height={91}
          width={91}
          className="w-full"
        />
        <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center z-10">
          <PopupVideo />
        </div>
      </div>

      {/* meeting thumbnail  */}

      <div
        className={`flex justify-between  ${
          type === 2 ? "mt-50px mb-5" : type === 3 ? "mb-50px" : "mb-5"
        }`}
      >
        <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px">
          {course?.discountedPrice ? (
            <>
              ${course.discountedPrice}{" "}
              <del className="text-sm text-lightGrey4 font-semibold">
                / ${course.price || "00.00"}
              </del>
            </>
          ) : (
            <>${course?.price || "00.00"}</>
          )}
        </div>

        <div>
          {course?.price && course?.discountedPrice && (
            <a
              href="#"
              className="uppercase text-sm font-semibold text-secondaryColor2 leading-27px px-2 bg-whitegrey1 dark:bg-whitegrey1-dark"
            >
              {Math.round(
                ((course.price - course.discountedPrice) / course.price) * 100
              )}
              % OFF
            </a>
          )}
        </div>
      </div>
      <div className="mb-5" data-aos="fade-up">
        <button
          onClick={() =>
            addProductToCart({
              id: course?._id,
            })
          }
          className="w-full text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border mb-10px leading-1.8 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
        >
          Add To Cart
        </button>

        <button className="w-full text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px mb-10px leading-1.8 border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-secondaryColor dark:hover:bg-whiteColor-dark">
          Buy Now
        </button>

        <span className="text-size-13 text-contentColor dark:text-contentColor-dark leading-1.8">
          <i className="icofont-ui-rotation"></i> 45-Days Money-Back Guarantee
        </span>
      </div>
      <ul>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Instructor:
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.instructor?.firstName + " " + course?.instructor?.lastName}
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Start Date
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.startDate &&
              new Date(course.startDate).toLocaleDateString()}
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Total Duration
          </p>
          {course?.chapters?.length > 0 && (
            <p className="text-xs text-contentColor dark:text-contentColor-dark px-2 py-1 bg-borderColor dark:bg-borderColor-dark rounded-full leading-4">
              {getTotalDuration(course.totalDuration)}
            </p>
          )}
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Enrolled
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.enrolled ?? "0"}
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Lectures
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.chapters?.length ?? "0"}
          </p>
        </li>
        {/* <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Skill Level
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            Basic
          </p>
        </li> */}
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Language
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.language}
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Quiz
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.chapters?.some((chapter) =>
              ["yes", "true", true].includes(
                chapter?.isLockedUntilQuizPass?.toString().toLowerCase()
              )
            )
              ? "Yes"
              : "No"}
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Assignments
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.assignments != "" ? "Yes" : "No"}
          </p>
        </li>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Certificate
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.certificateFile ? "Yes" : "No"}
          </p>
        </li>
      </ul>
      <div className="mt-5" data-aos="fade-up">
        <p className="text-sm text-contentColor dark:text-contentColor-dark leading-1.8 text-center mb-5px">
          More inquery about course
        </p>
        <button
          type="submit"
          className="w-full text-xl text-primaryColor bg-whiteColor px-25px py-10px mb-10px font-bold leading-1.8 border border-primaryColor hover:text-whiteColor hover:bg-primaryColor inline-block rounded group dark:bg-whiteColor-dark dark:text-whiteColor dark:hover:bg-primaryColor"
        >
          <i className="icofont-phone"></i> +47 333 78 901
        </button>
      </div>
    </div>
  );
};

export default CourseEnroll;
