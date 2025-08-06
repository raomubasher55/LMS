'use client';
import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) {
          onComplete();
        }
      }
    };

    // Calculate initially
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formatTime = (time) => time.toString().padStart(2, '0');

  if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <div className="countdown-timer bg-gray-100 p-3 rounded-lg mt-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Time remaining:</p>
        <div className="flex justify-center space-x-4 text-lg font-mono">
          <div className="bg-white px-3 py-2 rounded shadow">
            <span className="text-xl font-bold text-orange-600">{formatTime(timeLeft.hours)}</span>
            <p className="text-xs text-gray-500">Hours</p>
          </div>
          <div className="bg-white px-3 py-2 rounded shadow">
            <span className="text-xl font-bold text-orange-600">{formatTime(timeLeft.minutes)}</span>
            <p className="text-xs text-gray-500">Minutes</p>
          </div>
          <div className="bg-white px-3 py-2 rounded shadow">
            <span className="text-xl font-bold text-orange-600">{formatTime(timeLeft.seconds)}</span>
            <p className="text-xs text-gray-500">Seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;