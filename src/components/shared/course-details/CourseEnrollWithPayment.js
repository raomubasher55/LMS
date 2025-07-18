"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PopupVideo from "../popup/PopupVideo";
import axios from "axios";
import useSweetAlert from "@/hooks/useSweetAlert";

const CourseEnrollWithPayment = ({ course }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const createAlert = useSweetAlert();
  const router = useRouter();

  // Add defensive checks
  if (!course) {
    return (
      <div className="py-33px px-25px shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark rounded-md">
        <div className="text-center">
          <p className="text-gray-500">Course information not available</p>
        </div>
      </div>
    );
  }

  const isFree = course?.offerType === 'free';
  const currentPrice = course?.discountedPrice || course?.price || 0;

  useEffect(() => {
    if (course?._id) {
      checkCourseAccess();
    }
  }, [course?._id]);

  const checkCourseAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setCheckingAccess(false);
        return;
      }

      if (!course?._id) {
        setCheckingAccess(false);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/check-access/${course._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.success) {
        setHasAccess(response.data.hasAccess);
      }
    } catch (error) {
      console.error('Error checking course access:', error);
      // Don't show error alert here, just log it
    } finally {
      setCheckingAccess(false);
    }
  };

  const handleFreeCourseEnrollment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        createAlert('error', 'Please login to enroll in courses');
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/enroll-free`,
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        createAlert('success', 'Successfully enrolled in free course!');
        setHasAccess(true);
        // Redirect to lesson or dashboard
        setTimeout(() => {
          router.push('/dashboards/student-dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Free enrollment error:', error);
      createAlert('error', error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };

  const handlePremiumCoursePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        createAlert('error', 'Please login to purchase courses');
        return;
      }

      // Create payment session with Maxicash
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/create-session`,
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Store payment data and show form
        setPaymentData(response.data);
        
        // Automatically submit the form to redirect to Maxicash
        setTimeout(() => {
          document.getElementById('maxicash-payment-form').submit();
        }, 500);
      }
    } catch (error) {
      console.error('Payment error:', error);
      createAlert('error', error.response?.data?.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = () => {
    // Redirect to course learning page
    router.push(`/course/${course._id}/learn`);
  };

  const getTotalDuration = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  if (checkingAccess) {
    return (
      <div className="py-33px px-25px shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark rounded-md">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-33px px-25px shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark rounded-md"
      data-aos="fade-up"
    >
      {/* Course Image */}
      <div className="overflow-hidden relative mb-5">
        {course?.bannerImage ? (
          <Image
            src={course.bannerImage 
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.bannerImage}`
              : '/placeholder-course.jpg'}
            alt="course image"
            height={225}
            width={400}
            className="w-full rounded"
            unoptimized
          />
        ) : (
          <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
          </div>
        )}
        <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center z-10">
          <PopupVideo />
        </div>
      </div>

      {/* Price Section */}
      <div className="flex justify-between mb-5">
        <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px">
          {isFree ? (
            <span className="text-green-600 font-bold">FREE</span>
          ) : (
            <>
              ${currentPrice.toFixed(2)}
              {course?.discountedPrice && course?.price && (
                <del className="text-sm text-lightGrey4 font-semibold ml-2">
                  ${course.price.toFixed(2)}
                </del>
              )}
            </>
          )}
        </div>

        {course?.price && course?.discountedPrice && (
          <div className="uppercase text-sm font-semibold text-secondaryColor2 leading-27px px-2 bg-whitegrey1 dark:bg-whitegrey1-dark">
            {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Enrollment Buttons */}
      <div className="mb-5" data-aos="fade-up">
        {hasAccess ? (
          // User already has access
          <button
            onClick={handleStartLearning}
            className="w-full text-size-15 text-whiteColor bg-green-600 px-25px py-10px border mb-10px leading-1.8 border-green-600 hover:text-green-600 hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-play mr-2"></i>
            Start Learning
          </button>
        ) : isFree ? (
          // Free course enrollment
          <button
            onClick={handleFreeCourseEnrollment}
            disabled={loading}
            className="w-full text-size-15 text-whiteColor bg-green-600 px-25px py-10px border mb-10px leading-1.8 border-green-600 hover:text-green-600 hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="icofont-spinner animate-spin mr-2"></i>
                Enrolling...
              </span>
            ) : (
              <>
                <i className="icofont-plus mr-2"></i>
                Enroll Free Course
              </>
            )}
          </button>
        ) : (
          // Premium course payment
          <button
            onClick={handlePremiumCoursePayment}
            disabled={loading}
            className="w-full text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border mb-10px leading-1.8 border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="icofont-spinner animate-spin mr-2"></i>
                Processing...
              </span>
            ) : (
              <>
                <i className="icofont-credit-card mr-2"></i>
                Purchase Course - ${currentPrice.toFixed(2)}
              </>
            )}
          </button>
        )}

        <span className="text-size-13 text-contentColor dark:text-contentColor-dark leading-1.8 block text-center">
          <i className="icofont-ui-rotation mr-1"></i> 
          {isFree ? "Free Forever Access" : "Secure Payment via MaxiCash"}
        </span>
      </div>

      {/* Hidden Maxicash Payment Form */}
      {paymentData && (
        <form
          id="maxicash-payment-form"
          action={paymentData.gatewayUrl}
          method="POST"
          style={{ display: 'none' }}
        >
          <input type="hidden" name="PayType" value={paymentData.paymentData.PayType} />
          <input type="hidden" name="Amount" value={paymentData.paymentData.Amount} />
          <input type="hidden" name="Currency" value={paymentData.paymentData.Currency} />
          <input type="hidden" name="Phone" value={paymentData.paymentData.Phone} />
          <input type="hidden" name="Email" value={paymentData.paymentData.Email} />
          <input type="hidden" name="MerchantID" value={paymentData.paymentData.MerchantID} />
          <input type="hidden" name="MerchantPassword" value={paymentData.paymentData.MerchantPassword} />
          <input type="hidden" name="Language" value={paymentData.paymentData.Language} />
          <input type="hidden" name="Reference" value={paymentData.paymentData.Reference} />
          <input type="hidden" name="accepturl" value={paymentData.paymentData.accepturl} />
          <input type="hidden" name="cancelurl" value={paymentData.paymentData.cancelurl} />
          <input type="hidden" name="declineurl" value={paymentData.paymentData.declineurl} />
          <input type="hidden" name="notifyurl" value={paymentData.paymentData.notifyurl} />
        </form>
      )}

      {/* Course Details */}
      <ul>
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Instructor:
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {(course?.instructor?.firstName || '') + " " + (course?.instructor?.lastName || '')}
          </p>
        </li>
        
        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Course Type
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {isFree ? 'Free' : 'Premium'}
          </p>
        </li>

        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Total Duration
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-2 py-1 bg-borderColor dark:bg-borderColor-dark rounded-full leading-4">
            {course?.totalDuration ? getTotalDuration(course.totalDuration) : 'N/A'}
          </p>
        </li>

        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Enrolled
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {(course?.enrollmentCount || course?.enrolled || 0).toString()}
          </p>
        </li>

        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Lectures
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.chapters?.length ? course.chapters.length.toString() : "0"}
          </p>
        </li>

        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Language
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.language || 'N/A'}
          </p>
        </li>

        <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
          <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
            Certificate
          </p>
          <p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
            {course?.certificateFile ? "Yes" : "Yes"}
          </p>
        </li>
      </ul>

      {/* Contact Section */}
      <div className="mt-5" data-aos="fade-up">
        <p className="text-sm text-contentColor dark:text-contentColor-dark leading-1.8 text-center mb-5px">
          Need help with this course?
        </p>
        <button
          type="button"
          className="w-full text-xl text-primaryColor bg-whiteColor px-25px py-10px mb-10px font-bold leading-1.8 border border-primaryColor hover:text-whiteColor hover:bg-primaryColor inline-block rounded group dark:bg-whiteColor-dark dark:text-whiteColor dark:hover:bg-primaryColor"
        >
          <i className="icofont-ui-message mr-2"></i> Contact Support
        </button>
      </div>
    </div>
  );
};

export default CourseEnrollWithPayment;