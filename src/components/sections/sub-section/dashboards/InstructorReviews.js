"use client";
import TranslatedText from "@/components/shared/TranslatedText";
import { useState, useEffect } from "react";

const InstructorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/instructor/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const reviewsData = data.data || [];
        setReviews(reviewsData.slice(0, 5)); // Show latest 5 reviews

        // Calculate stats
        if (reviewsData.length > 0) {
          const total = reviewsData.length;
          const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
          const average = (sum / total).toFixed(1);

          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          reviewsData.forEach(review => {
            distribution[review.rating]++;
          });

          setStats({
            averageRating: average,
            totalReviews: total,
            ratingDistribution: distribution
          });
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
      >
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-30px">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-30px">
      <div className="flex justify-between items-center mb-25px">
        <h3 className="text-size-22 font-bold text-blackColor dark:text-blackColor-dark leading-30px">
           <TranslatedText>Avis sur le cours</TranslatedText>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
            {stats.averageRating}
          </span>
          <div className="flex">{renderStars(Math.round(stats.averageRating))}</div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ({stats.totalReviews} Avis)
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500 dark:text-gray-400">
           <TranslatedText>Pas encore d'avis. Continuez à créer du contenu de qualité pour obtenir des avis d'étudiants&nbsp;!</TranslatedText>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Rating Distribution */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="text-center">
                <div className="text-sm font-medium text-blackColor dark:text-blackColor-dark">
                  {rating}★
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: stats.totalReviews > 0 
                        ? `${(stats.ratingDistribution[rating] / stats.totalReviews) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stats.ratingDistribution[rating]}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Reviews */}
          <div className="space-y-4">
            <h4 className="font-semibold text-blackColor dark:text-blackColor-dark">
               <TranslatedText>Avis récents</TranslatedText>
            </h4>
            {reviews.map((review, index) => (
              <div
                key={index}
                className="p-4 border border-borderColor dark:border-borderColor-dark rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {review.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-blackColor dark:text-blackColor-dark">
                        {review.name || 'Anonymous Student'}
                      </div>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorReviews;