"use client";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

const VideoPlayer = ({ videoUrl, title, poster, courseId, chapterId, onVideoCompleted }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watchTimeUpdateInterval, setWatchTimeUpdateInterval] = useState(null);
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);

  // Function to update watch time on backend
  const updateWatchTime = async (watchTime, totalDuration) => {
    if (!courseId || !chapterId) return;
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/progress/watch-time`,
        {
          courseId,
          chapterId,
          watchTime: Math.floor(watchTime),
          totalDuration: Math.floor(totalDuration)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating watch time:', error);
    }
  };


  // Function to mark video as completed
  const markVideoCompleted = async () => {
    if (!courseId || !chapterId || hasMarkedComplete) return;
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/progress/complete-video`,
        { courseId, chapterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setHasMarkedComplete(true);
        
        // Also mark as re-watched for quiz restrictions
        
        if (onVideoCompleted) {
          onVideoCompleted(chapterId, response.data.data);
        }
        console.log('Video marked as completed!');
      }
    } catch (error) {
      console.error('Error marking video as completed:', error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      setCurrentTime(currentTime);

      // Check for completion (90% watched)
      if (duration > 0 && !hasMarkedComplete) {
        const watchPercentage = (currentTime / duration) * 100;
        if (watchPercentage >= 90) {
          markVideoCompleted();
        }
      }
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      
      // Start periodic watch time updates (every 10 seconds)
      const interval = setInterval(() => {
        if (video.currentTime && duration) {
          updateWatchTime(video.currentTime, duration);
        }
      }, 10000);
      setWatchTimeUpdateInterval(interval);
    };

    const handlePause = () => {
      setIsPlaying(false);
      
      // Clear watch time update interval
      if (watchTimeUpdateInterval) {
        clearInterval(watchTimeUpdateInterval);
        setWatchTimeUpdateInterval(null);
      }

      // Update watch time when pausing
      if (video.currentTime && duration) {
        updateWatchTime(video.currentTime, duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (!hasMarkedComplete) {
        markVideoCompleted();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      
      if (watchTimeUpdateInterval) {
        clearInterval(watchTimeUpdateInterval);
      }
    };
  }, [duration, hasMarkedComplete, watchTimeUpdateInterval, courseId, chapterId]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      video.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVideoSource = () => {
    if (videoUrl?.startsWith('http')) {
      return videoUrl;
    }
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${videoUrl}`;
  };

  return (
    <div className="relative w-full bg-black group">
      <video
        ref={videoRef}
        className="w-full h-auto max-h-96 lg:max-h-[500px]"
        poster={poster ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${poster}` : undefined}
        onClick={togglePlay}
      >
        <source src={getVideoSource()} type="video/mp4" />
        <p className="text-white">Your browser does not support the video tag.</p>
      </video>

      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 3.5A1.5 1.5 0 017 2h6a1.5 1.5 0 011.5 1.5v13a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 16.5v-13zM8 4v12h4V4H8z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div
              className="w-full h-2 bg-white/30 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primaryColor rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 3.5A1.5 1.5 0 017 2h6a1.5 1.5 0 011.5 1.5v13a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 16.5v-13z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zM17 4a1 1 0 00-1-1h-4a1 1 0 000 2h1.586l-2.293 2.293a1 1 0 001.414 1.414L15 6.414V8a1 1 0 002 0V4zM17 16a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 012 0v4zM3 16a1 1 0 001 1h4a1 1 0 000-2H6.414l2.293-2.293a1 1 0 00-1.414-1.414L5 13.586V12a1 1 0 00-2 0v4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!duration && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;