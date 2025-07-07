'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-email/${token}`);
        setStatus(res.data.message);

        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (error) {
        setStatus(error.response?.data?.message || 'Verification failed');
      }
    };

    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <div className="text-center p-8 bg-white dark:bg-gray-900 rounded shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Email Verification</h1>
        <p className="text-gray-600 dark:text-gray-300">{status}</p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
