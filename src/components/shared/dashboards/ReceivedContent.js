import React, { useEffect, useState } from "react";

const ReceivedContent = ( { role } ) => {
  const [reviews, setReviews] = useState([]);

useEffect(() => {
  const fetchReviews = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        console.error("No token found!");
        return;
      }

      const endpoint =
        role === "admin"
          ? "/api/admin/all-instructor-reviews"
          : "/api/instructor/reviews";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch reviews");

      const data = await res.json();
      const sortedReviews = (data.reviews || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setReviews(sortedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  fetchReviews();
}, [role]);


  const renderStars = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-star w-4 inline-block text-primaryColor"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ));
  };


  return (
    <div className="overflow-auto">
      <table className="w-full text-left">
        <thead className="text-sm md:text-base text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark leading-1.8 md:leading-1.8">
          <tr>
            <th className="px-5px py-10px md:px-5">Name</th>
            <th className="px-5px py-10px md:px-5">Date</th>
            <th className="px-5px py-10px md:px-5">Feedback</th>
          </tr>
        </thead>
        </table>

        <div className={reviews.length > 5 ? "max-h-[400px] overflow-y-auto" : ""}>
        <table className="w-max sm:w-full text-left">
        <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">

        {reviews.map((review, index) => (
          <tr key={index} className="leading-1.8 md:leading-1.8">
            <th className="px-5px py-10px md:px-5 font-normal">
              <p className="text-blackColor dark:text-blackColor-dark text-nowrap">
                {review.userName}
              </p>
            </th>
            <td className="px-5px py-10px md:px-5 text-nowrap">
              <p>{new Date(review.date).toLocaleDateString()}</p>
            </td>
            <td className="px-5px py-10px md:px-5">
              <p className="md:text-size-15 text-blackColor dark:text-blackColor-dark font-bold">
              Course: {review.courseTitle.length > 20 ? review.courseTitle.slice(0, 20) + '...' : review.courseTitle}
              </p>
              <div>
                {/* review */}
                <div className="text-primaryColor flex items-center gap-2">
                <div className="text-primaryColor">{renderStars(review.rating)}</div>
                  <span className="md:text-sm text-blackColor dark:text-blackColor-dark font-bold">
                    ({review.rating} Reviews)
                  </span>
                </div>
              </div>
              <p>{review.review}</p>
            </td>
          </tr>

        ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ReceivedContent;
