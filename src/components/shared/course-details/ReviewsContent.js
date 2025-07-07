import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
const ReviewsContent = ({ course }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    review: "",
    rating: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [reviewsState, setReviewsState] = useState({});

  useEffect(() => {
    if (!course?._id) return;

    const fetchData = async () => {
      try {
        const [reviewsRes, statsRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${course._id}`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${course._id}/stats`
          ),
        ]);
        setReviews(reviewsRes.data);
        setReviewsState(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch reviews or stats:", error);
      }
    };

    fetchData();
  }, [course]);


  const handleRatingClick = (index) => {
    setFormData({ ...formData, rating: index + 1 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${course?._id}/reviews`,
        {
          name: formData.name,
          email: formData.email,
          website: formData.website,
          review: formData.review,
          rating: formData.rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Review submitted successfully");
      setFormData({
        name: "",
        email: "",
        website: "",
        review: "",
        rating: 0,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  const totalReviews = Object.values(reviewsState).reduce((a, b) => a + b, 0);

  const getPercentage = (count) => {
    if (totalReviews === 0) return "w-0";
    const percentage = (count / totalReviews) * 100;
    if (percentage >= 100) return "w-full";
    return `w-[${percentage.toFixed(0)}%]`; // Tailwind compatible
  };

  const starRatings = [5, 4, 3, 2, 1];

  const totalReviewsCount = Object.values(reviewsState).reduce(
    (acc, val) => acc + val,
    0
  );

  const averageRating =
    totalReviews > 0
      ? (
          Object.entries(reviewsState).reduce(
            (sum, [rating, count]) => sum + Number(rating) * count,
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-x-30px gap-y-5">
        <div className="lg:col-start-1 lg:col-span-4 px-10px py-30px bg-whiteColor dark:bg-whiteColor-dark shadow-review text-center">
          <p className="text-7xl font-extrabold text-blackColor dark:text-blackColor-dark leading-90px">
            {averageRating}
          </p>
          <div className="text-secondaryColor">
            {Array.from({ length: 5 }).map((_, idx) => (
              <i
                key={idx}
                className={`icofont-star ${
                  idx < Math.round(averageRating)
                    ? "text-secondaryColor"
                    : "text-borderColor"
                }`}
              ></i>
            ))}
          </div>
          <p className="text-blackColor dark:text-blackColor-dark leading-26px font-medium">
            ({totalReviewsCount} Reviews)
          </p>
        </div>

        {/* progress bar  */}
        <div className="lg:col-start-5 lg:col-span-8 px-15px">
          <ul className="flex flex-col gap-y-3">
            {starRatings.map((star) => (
              <li
                key={star}
                className="flex items-center text-blackColor dark:text-blackColor-dark"
              >
                <div>
                  <span>{star}</span>{" "}
                  <span>
                    <i className="icofont-star text-secondaryColor"></i>
                  </span>
                </div>
                <div className="flex-grow relative mx-10px md:mr-10 lg:mr-10px">
                  <span className="h-10px w-full bg-borderColor dark:bg-borderColor-dark rounded-full block"></span>
                  <span
                    className={`absolute left-0 top-0 h-10px bg-secondaryColor rounded-full ${getPercentage(
                      reviewsState[star] || 0
                    )}`}
                  ></span>
                </div>
                <div>
                  <span>{reviewsState[star] || 0}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* client reviews  */}
      <div className="mt-60px mb-10">
        <h4 className="text-lg text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-secondaryColor before:absolute before:bottom-[5px] before:left-0 leading-1.2 mb-25px">
          Customer Reviews
        </h4>

        {reviews.length > 0 ? (
          <div className="max-h-[600px] overflow-y-auto pr-2">
            <ul>
              {reviews.map((review) => (
                <li
                  key={review._id}
                  className="flex gap-30px pt-35px border-t border-borderColor2 dark:border-borderColor2-dark"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}${review.user?.profile}` ||
                        "/default-profile.png"
                      }
                      alt={review.user?.firstName}
                      width={60}
                      height={60}
                      className=" rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h4>
                          <span className="text-lg font-semibold text-blackColor hover:text-secondaryColor dark:text-blackColor-dark dark:hover:text-secondaryColor leading-1.2">
                            {review.user?.firstName} {review.user?.lastName}
                          </span>
                        </h4>
                        <div className="text-secondaryColor leading-1.8">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`icofont-star ${
                                i < review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <div className="author__icon">
                        <p className="text-sm font-bold text-blackColor dark:text-blackColor-dark leading-9 px-25px mb-5px border-2 border-borderColor2 dark:border-borderColo2-dark hover:border-secondaryColor dark:hover:border-secondaryColor rounded-full transition-all duration-300">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-contentColor dark:text-contentColor-dark leading-23px mb-15px">
                      {review.review}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No reviews yet for this course.
          </p>
        )}
      </div>

      {/* add reviews  */}
      <div className="p-5 md:p-50px mb-50px bg-lightGrey12 dark:bg-transparent dark:shadow-brand-dark">
        <h4
          className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-15px !leading-1.2"
          data-aos="fade-up"
        >
          Add a Review
        </h4>
        <div className="flex gap-15px items-center mb-30px">
          <h6 className="font-bold text-blackColor dark:text-blackColor-dark !leading-[19.2px]">
            Your Ratings:
          </h6>
          <div className="text-secondaryColor leading-1.8">
            {[...Array(5)].map((_, index) => (
              <i
                key={index}
                className={`icofont-star hover:text-primaryColor cursor-pointer ${
                  index < formData.rating
                    ? "text-secondaryColor"
                    : "text-gray-400"
                }`}
                onClick={() => handleRatingClick(index)}
              ></i>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="pt-5" data-aos="fade-up">
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            placeholder="Type you comments...."
            className="w-full p-5 mb-8 bg-transparent text-sm text-blackColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border border-transparent dark:border-borderColor2-dark placeholder:text-placeholder k"
            cols="30"
            rows={5}
            required
          />
          <div className="grid grid-cols-1 mb-10 gap-10">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Type your name...."
              className="w-full pl-5 bg-transparent text-sm focus:outline-none text-blackColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border border-transparent dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Type your email...."
              className="w-full pl-5 bg-transparent text-sm focus:outline-none text-blackColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border border-transparent dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              required
            />
          </div>

          <div className="grid grid-cols-1 mb-10 gap-10">
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Your website (optional)"
              className="w-full pl-5 bg-transparent text-sm focus:outline-none text-blackColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark placeholder:text-placeholder border border-transparent dark:border-borderColor2-dark placeholder:opacity-80 h-15 leading-15 font-medium rounded"
            />
          </div>

          <div>
            <input type="checkbox" />{" "}
            <span className="text-size-15 text-darkBlue dark:text-darkBlue-dark">
              Save my name, email, and website in this browser for the next time
              I comment.
            </span>
          </div>
          <div className="mt-30px">
            <button
              type="submit"
              className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewsContent;
