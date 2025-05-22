"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const PaymentSuccess = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [course, setCourse] = useState(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      handlePaymentVerification();
    } else {
      setStatus('error');
      setMessage('Invalid payment session');
    }
  }, [sessionId]);

  const handlePaymentVerification = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/success?sessionId=${sessionId}`
      );

      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        setCourse(response.data.course);
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
      setMessage('Failed to verify payment. Please contact support.');
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Verifying Payment...
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we confirm your payment.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-12 h-12 mx-auto mb-4">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                
                {course && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Course Enrolled:
                    </h3>
                    <p className="text-primaryColor font-medium">
                      {course.title}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Link
                    href="/dashboards/student-dashboard"
                    className="block w-full bg-primaryColor hover:bg-primaryColor/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/dashboards/student-enrolled-courses"
                    className="block w-full border border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    View My Courses
                  </Link>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-12 h-12 mx-auto mb-4">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Payment Error
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                
                <div className="space-y-3">
                  <Link
                    href="/courses"
                    className="block w-full bg-primaryColor hover:bg-primaryColor/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Browse Courses
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentSuccess;