'use client';
import { useState } from 'react';
import useSweetAlert from '@/hooks/useSweetAlert';

const ChapterList = ({ course, currentVideoId, onVideoSelect, compact = false, progressData }) => {
  const createAlert = useSweetAlert();
  // Always expand the first chapter by default
  const [expandedChapter, setExpandedChapter] = useState(0);

  const isChapterCompleted = (chapterId) => {
    return progressData?.completedChapters?.includes(chapterId) || false;
  };

  const isChapterQuizPassed = (chapterId) => {
    const quizAttempt = progressData?.quizProgress?.find(
      quiz => quiz.chapterId === chapterId && quiz.courseId === course?._id
    );
    return quizAttempt && (quizAttempt.passed || quizAttempt.bestScore >= 60);
  };

  const isChapterAccessible = (chapterIndex) => {
    // First chapter is always accessible
    if (chapterIndex === 0) return true;
    
    // For subsequent chapters, check if previous chapter's quiz was passed
    const previousChapter = course?.chapters?.[chapterIndex - 1];
    if (!previousChapter) return false;
    
    // If previous chapter has no quiz, it's automatically considered "passed"
    if (!previousChapter.quiz || previousChapter.quiz.length === 0) {
      return true;
    }
    
    // If previous chapter has a quiz, check if it was passed
    return isChapterQuizPassed(previousChapter._id);
  };

  const isVideoAccessible = (chapterIndex, videoIndex) => {
    // Check if chapter is accessible first
    if (!isChapterAccessible(chapterIndex)) return false;
    
    // For videos within accessible chapters:
    // First video is always accessible
    if (videoIndex === 0) return true;
    
    // For subsequent videos, video completion is tracked by chapter completion
    // So all videos in an accessible chapter are accessible
    return true;
  };

  const toggleChapter = (chapterIndex) => {
    setExpandedChapter(expandedChapter === chapterIndex ? -1 : chapterIndex);
  };

  const handleVideoSelect = (video, chapterIndex, videoIndex) => {
    if (!isVideoAccessible(chapterIndex, videoIndex)) {
      // Show alert for locked content
      const previousChapter = course?.chapters?.[chapterIndex - 1];
      createAlert('warning', `This chapter is locked. Complete the quiz for "${previousChapter?.title}" with 60% or higher to unlock.`);
      return;
    }
    onVideoSelect(video);
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Debug logs removed to prevent console spam

  return (
    <div className="course-chapters">
      {!compact && <h3 className="chapter-title mb-4">Course Content</h3>}
      
      {course?.chapters?.map((chapter, chapterIndex) => {
        const isCompleted = isChapterCompleted(chapter._id);
        const isAccessible = isChapterAccessible(chapterIndex);
        const isQuizPassed = isChapterQuizPassed(chapter._id);
        
        return (
          <div key={chapterIndex} className={`chapter-item ${compact ? 'mb-2' : 'mb-3'}`}>
            <div 
              className={`chapter-header cursor-pointer ${compact ? 'p-2' : 'p-3'} ${
                !isAccessible
                  ? 'bg-gray-100 border border-gray-300 opacity-60'
                  : isCompleted 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
              } rounded-lg transition-colors`}
              onClick={() => isAccessible && toggleChapter(chapterIndex)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {!isAccessible ? (
                    <i className="icofont-lock text-gray-400"></i>
                  ) : isQuizPassed ? (
                    <i className="icofont-check-circled text-green-600"></i>
                  ) : isCompleted ? (
                    <i className="icofont-check text-blue-600"></i>
                  ) : null}
                  <h4 className={`font-medium ${
                    !isAccessible 
                      ? 'text-gray-400' 
                      : isCompleted 
                        ? 'text-green-800' 
                        : 'text-gray-800'
                  } ${compact ? 'text-sm' : ''}`}>
                    {chapter.title}
                  </h4>
                  {!isAccessible && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      Locked
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!compact && (
                    <span className="text-sm text-gray-500">
                      {chapter.videos?.length || 0} videos
                    </span>
                  )}
                  <i className={`icofont-rounded-${expandedChapter === chapterIndex ? 'up' : 'down'} text-gray-600 ${compact ? 'text-sm' : ''}`}></i>
                </div>
              </div>
            </div>
          
          {expandedChapter === chapterIndex && (
            <div className={`chapter-videos mt-2 ${compact ? 'ml-2' : 'ml-4'}`}>
              {chapter.videos?.map((video, videoIndex) => {
                const videoCompleted = isCompleted; // Since we track completion by chapter
                const videoAccessible = isVideoAccessible(chapterIndex, videoIndex);
                
                return (
                  <div 
                    key={videoIndex}
                    className={`video-item ${compact ? 'p-2' : 'p-3'} rounded transition-colors mb-2 ${
                      !videoAccessible
                        ? 'bg-gray-100 border border-gray-300 opacity-60 cursor-not-allowed'
                        : currentVideoId === video._id 
                          ? 'bg-blue-50 border-l-4 border-blue-500 cursor-pointer' 
                          : videoCompleted
                            ? 'bg-green-50 border border-green-200 hover:bg-green-100 cursor-pointer'
                            : 'bg-white hover:bg-gray-50 border border-gray-200 cursor-pointer'
                    }`}
                    onClick={() => handleVideoSelect(video, chapterIndex, videoIndex)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="video-icon">
                          {!videoAccessible ? (
                            <i className={`icofont-lock text-gray-400 ${compact ? 'text-sm' : ''}`}></i>
                          ) : currentVideoId === video._id ? (
                            <i className={`icofont-ui-play text-blue-500 ${compact ? 'text-sm' : ''}`}></i>
                          ) : videoCompleted ? (
                            <i className={`icofont-check-circled text-green-500 ${compact ? 'text-sm' : ''}`}></i>
                          ) : (
                            <i className={`icofont-play-alt-1 text-gray-400 ${compact ? 'text-sm' : ''}`}></i>
                          )}
                        </div>
                        <div>
                          <h5 className={`font-medium ${
                            !videoAccessible 
                              ? 'text-gray-400' 
                              : videoCompleted 
                                ? 'text-green-800' 
                                : 'text-gray-800'
                          } ${compact ? 'text-sm' : ''}`}>
                            {video.title}
                          </h5>
                          {video.description && !compact && (
                            <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="video-info text-right">
                        {!compact && (
                          <span className="text-sm text-gray-500">
                            {formatDuration(video.duration)}
                          </span>
                        )}
                        {!videoAccessible ? (
                          <span className={`inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full ${compact ? 'text-xs' : 'ml-2'}`}>
                            Locked
                          </span>
                        ) : videoCompleted ? (
                          <span className={`inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full ${compact ? 'text-xs' : 'ml-2'}`}>
                            Completed
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        );
      }) || (
        <div className="no-chapters p-4 text-center text-gray-500">
          <i className="icofont-video-alt text-4xl mb-2"></i>
          <p>No course content available</p>
        </div>
      )}
    </div>
  );
};

export default ChapterList;