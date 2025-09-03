"use client";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

const VideoPlayer = ({
  videoData,
  title,
  poster,
  courseId,
  chapterId,
  onVideoCompleted,
}) => {
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Function to update watch time on backend
  const updateWatchTime = async (watchTime, totalDuration) => {
    if (!courseId || !chapterId) return;

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/progress/watch-time`,
        {
          courseId,
          chapterId,
          watchTime: Math.floor(watchTime),
          totalDuration: Math.floor(totalDuration),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating watch time:", error);
    }
  };


const markVideoCompleted = async () => {
  if (!courseId || !chapterId || !videoData?.vimeoId || hasMarkedComplete) return;

  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/progress/complete-video`,
      { courseId, chapterId, vimeoId: videoData.vimeoId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      setHasMarkedComplete(true);

      if (onVideoCompleted) {
       onVideoCompleted(videoData._id, response.data.data);
      }
      console.log("Video marked as completed!");
    }
  } catch (error) {
    console.error("Error marking video as completed:", error);
  }
};


  useEffect(() => {
    setIsLoading(false);
    setHasMarkedComplete(false);
    setIsMounted(true);

    // Debug logging
    console.log("VideoPlayer received data:", {
      videoData,
      title,
      courseId,
      chapterId,
      hasVimeoId: !!videoData?.vimeoId,
    });
  }, [videoData, courseId, chapterId, title]);

  // Manual completion function
  const handleMarkComplete = () => {
    if (!hasMarkedComplete) {
      markVideoCompleted();
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getEmbedCode = () => {
    if (!videoData) return "";

    try {
      // Use embedCode if available, otherwise use url
      const embedCode = videoData.embedCode || videoData.url || "";

      // Validate that we have iframe content
      if (!embedCode.includes("<iframe") && !embedCode.includes("iframe")) {
        setVideoError("Invalid video embed code format");
        return "";
      }

      return embedCode;
    } catch (error) {
      console.error("Error processing embed code:", error);
      setVideoError("Failed to process video embed code");
      return "";
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="relative w-full bg-black">
        <div className="w-full h-96 lg:h-[500px] flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black">
      {/* Vimeo Video Player */}
      {console.log("Render check:", {
        hasVideoData: !!videoData,
        hasVimeoId: !!videoData?.vimeoId,
        vimeoId: videoData?.vimeoId,
        hasError: !!videoError,
        shouldRender: !!(videoData && videoData.vimeoId && !videoError),
      })}
      {videoData &&
      (videoData.vimeoId || videoData.embedCode || videoData.url) &&
      !videoError ? (
        <div className="w-full h-auto min-h-[300px] lg:min-h-[500px]">
          {/* Try multiple rendering methods */}
          {(() => {
            // Method 1: Prefer the signed URL HTML if available
            if (videoData.url && videoData.url.includes("iframe")) {
              console.log("Using url HTML (preferred):", videoData.url);
              return (
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: videoData.url }}
                />
              );
            }

            // Method 2: Fallback to embedCode HTML
            if (videoData.embedCode && videoData.embedCode.includes("iframe")) {
              console.log(
                "Using embedCode HTML (fallback):",
                videoData.embedCode
              );
              return (
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: videoData.embedCode }}
                />
              );
            }

            // Method 3: Build iframe from vimeoId (fallback)
            if (videoData.vimeoId) {
              console.log("Using vimeoId iframe:", videoData.vimeoId);
              return (
                <iframe
                  src={`https://player.vimeo.com/video/${videoData.vimeoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`}
                  width="100%"
                  height="500"
                  className="w-full h-[300px] lg:h-[500px]"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={title || "Course Video"}
                />
              );
            }

            return null;
          })()}
        </div>
      ) : (
        <div className="w-full h-96 lg:h-[500px] flex items-center justify-center bg-gray-800">
          <div className="text-center text-white">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 5v10l8-5-8-5z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">No Video Available</h3>
            <p className="text-sm text-gray-400">
              {videoError ||
                (videoData
                  ? "Video embed code not found"
                  : "No video data provided")}
            </p>
            {videoData?.vimeoId && (
              <p className="text-xs text-gray-500 mt-2">
                Vimeo ID: {videoData.vimeoId}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Video Controls Overlay */}
      {videoData && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <div className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Duration: {formatTime(videoData.duration || 0)}</span>
            </div>
          </div>

          {/* Mark Complete Button */}
          <button
            onClick={handleMarkComplete}
            disabled={hasMarkedComplete}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              hasMarkedComplete
                ? "bg-green-600 text-white cursor-not-allowed"
                : "bg-primaryColor hover:bg-primaryColor/90 text-white"
            }`}
          >
            {hasMarkedComplete ? "Completed ✓" : "Mark Complete"}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error State */}
      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-white p-4">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Video Load Error</h3>
            <p className="text-sm text-gray-300">{videoError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
