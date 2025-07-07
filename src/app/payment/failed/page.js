"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Suspense } from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

const PaymentFailedContent = () => {
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && reference) {
      checkPaymentStatus();
    } else if (mounted) {
      setLoading(false);
    }
  }, [reference, mounted]);

  const checkPaymentStatus = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/status/${reference}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setOrderInfo(response.data.order);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Loading...
              </h2>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            
            <div className="w-12 h-12 mx-auto mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your payment could not be processed. This might be due to insufficient funds, 
              network issues, or payment cancellation.
            </p>

            {orderInfo && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Details:
                </h3>
                {orderInfo.course && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Course: {orderInfo.course.title}
                  </p>
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Amount: ${orderInfo.amount} {orderInfo.currency}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">
                  Reference: {orderInfo.reference}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Status: {orderInfo.status}
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                  Please include this reference when contacting support.
                </p>
              </div>
            )}

            {reference && !orderInfo && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Reference: {reference}
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Please include this reference when contacting support.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {orderInfo && orderInfo.course && (
                <Link
                  href={`/courses/${orderInfo.course._id || orderInfo.course.id}`}
                  className="block w-full bg-primaryColor hover:bg-primaryColor/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Try Payment Again
                </Link>
              )}
              
              <Link
                href="/courses"
                className="block w-full border border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Browse Other Courses
              </Link>
              
              <Link
                href="/contact"
                className="block w-full border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Contact Support
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Payment Options:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                <li>• MaxiCash wallet</li>
                <li>• Credit/Debit cards</li>
                <li>• Mobile Money (Airtel, M-Pesa, Orange)</li>
                <li>• Mobile Banking</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const LoadingFallback = () => (
  <PageWrapper>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Payment Status...
          </h2>
        </div>
      </div>
    </div>
  </PageWrapper>
);

const PaymentFailed = () => {
  return (
    <ErrorBoundary fallbackMessage="There was an error loading the payment status page.">
      <Suspense fallback={<LoadingFallback />}>
        <PaymentFailedContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default PaymentFailed;