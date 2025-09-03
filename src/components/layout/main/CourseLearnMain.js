"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayer from "@/components/shared/video/VideoPlayer";
import ChapterList from "@/components/shared/course-learn/ChapterList";
import CourseResources from "@/components/shared/course-learn/CourseResources";
import CourseProgress from "@/components/shared/course-learn/CourseProgress";
import ChapterQuiz from "@/components/shared/course-learn/ChapterQuiz";
import CourseAssignments from "@/components/shared/course-learn/CourseAssignments";
import useSweetAlert from "@/hooks/useSweetAlert";

const CourseLearnMain = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');
  const [progressData, setProgressData] = useState(null);
  const createAlert = useSweetAlert();

  useEffect(() => {
    if (courseId && courseId !== 'undefined') {
      fetchCourseData();
      checkAccess();
    } else {
      setLoading(false);
      createAlert('error', 'Invalid course ID');
    }
  }, [courseId]);

  useEffect(() => {
    if (course && hasAccess && courseId) {
      fetchCourseProgress();
    }
  }, [course?._id, hasAccess]); // Only depend on course ID, not the entire course object

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${courseId}`
      );
      
      if (response.data) {
        // Handle both wrapped and direct course data
        const courseData = response.data.course || response.data;
        
        // Transform the course data to match our component structure
        const transformedCourse = {
          ...courseData,
          chapters: courseData.chapters?.map(chapter => ({
            ...chapter,
            videos: chapter.lessons?.map(lesson => {
              
              return {
                ...lesson.video,
                _id: lesson._id,
                chapterId: lesson._id, // Use lesson._id as chapterId for backend API
                lessonId: lesson._id,
                chapterTitle: chapter.title,
                title: lesson.title || lesson.video?.title,
                description: lesson.description || chapter.description || '',
                videoData: lesson.video // Pass the complete video object
              };
            }) || []
          })) || []
        };
        
        setCourse(transformedCourse);
        
        // Set first video as default
        if (transformedCourse.chapters && transformedCourse.chapters.length > 0) {
          const firstChapter = transformedCourse.chapters[0];
          if (firstChapter.videos && firstChapter.videos.length > 0) {
            setCurrentVideo(firstChapter.videos[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      createAlert('error', 'Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setHasAccess(false);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/check-access/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setHasAccess(response.data.hasAccess);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    }
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
  };

  const handleVideoCompleted = (chapterId, progressData) => {
    console.log('Video completed:', chapterId, progressData);
    // Refresh course progress
    fetchCourseProgress();
  };

  const handleQuizCompleted = (chapterId, score) => {
    console.log('Quiz completed:', chapterId, score);
    
    // If quiz passed with 60% or higher, show success message about unlocking next chapter
    if (score >= 60) {
      const currentChapterIndex = course?.chapters?.findIndex(ch => ch._id === chapterId);
      const nextChapter = course?.chapters?.[currentChapterIndex + 1];
      
      if (nextChapter) {
        createAlert('success', `Great job! You've unlocked the next chapter: "${nextChapter.title}"`);
      } else {
        createAlert('success', 'Congratulations! You\'ve completed all chapters in this course!');
      }
    }
    
    // Refresh course progress to update UI
    fetchCourseProgress();
  };

  const handleAssignmentSubmitted = (assignmentId) => {
    console.log('Assignment submitted:', assignmentId);
    // Refresh course progress
    fetchCourseProgress();
  };

  const fetchCourseProgress = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/progress/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const progressInfo = response.data.data;
        setProgressData(progressInfo);
        
        // Don't update course state here to avoid infinite loop
        // Progress data will be passed to components directly
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to enroll in this course to access the content.
          </p>
          <a
            href={`/courses/${courseId}`}
            className="bg-primaryColor hover:bg-primaryColor/90 text-white px-6 py-3 rounded-lg font-medium"
          >
            View Course Details
          </a>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The course you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Debug logs cleaned up

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Course Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {course?.title || 'Loading...'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instructor: {course?.instructor?.firstName} {course?.instructor?.lastName}
              </p>
            </div>
            <a
              href="/dashboards/student-dashboard"
              className="text-primaryColor hover:underline text-sm"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            {currentVideo ? (
              <div key={currentVideo._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
                <VideoPlayer
                  key={currentVideo._id}
                  videoData={currentVideo.videoData || currentVideo}
                  title={currentVideo.title}
                  poster={course.bannerImage ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${course.bannerImage}` : null}
                  courseId={courseId}
                  chapterId={currentVideo.chapterId || currentVideo._id}
                  onVideoCompleted={handleVideoCompleted}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {currentVideo.title}
                  </h2>
                  {currentVideo.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {currentVideo.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Duration: {Math.floor((currentVideo.videoData?.duration || currentVideo.duration || 0) / 60)} minutes
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center mb-6">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Video Selected
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a video from the chapter list to start watching.
                </p>
              </div>
            )}

            {/* Tabs for Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('chapters')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'chapters'
                        ? 'border-primaryColor text-primaryColor'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Course Content
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'quiz'
                        ? 'border-primaryColor text-primaryColor'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Quiz
                  </button>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'assignments'
                        ? 'border-primaryColor text-primaryColor'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Assignments
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'resources'
                        ? 'border-primaryColor text-primaryColor'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Resources
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'chapters' && (
                  <ChapterList 
                    course={course}
                    currentVideoId={currentVideo?._id}
                    onVideoSelect={handleVideoSelect}
                    progressData={progressData}
                  />
                )}
                
                {activeTab === 'quiz' && (
                  currentVideo ? (
                    <ChapterQuiz
                      courseId={courseId}
                      chapterId={currentVideo.lessonId || currentVideo._id}
                      quizzes={(() => {
                        // Find the chapter that contains this lesson
                        const chapter = course?.chapters?.find(ch => 
                          ch.lessons?.some(lesson => lesson._id === currentVideo.lessonId)
                        );
                        return chapter?.quiz || [];
                      })()}
                      onQuizCompleted={handleQuizCompleted}
                      progressData={progressData}
                    />
                  ) : (
                    <div className="quiz-no-video bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                      <p className="text-gray-600 dark:text-gray-400">Please select a video to view the associated quiz.</p>
                    </div>
                  )
                )}
                
                {activeTab === 'assignments' && (
                  <CourseAssignments 
                    courseId={courseId}
                    onAssignmentSubmitted={handleAssignmentSubmitted}
                  />
                )}
                
                {activeTab === 'resources' && (
                  <CourseResources 
                    course={course} 
                    progressData={progressData}
                    courseId={courseId}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CourseProgress 
              course={course}
              currentVideoId={currentVideo?._id}
              progressData={progressData}
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Navigation
              </h3>
              
              <ChapterList 
                course={course}
                currentVideoId={currentVideo?._id}
                onVideoSelect={handleVideoSelect}
                compact={true}
                progressData={progressData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearnMain;