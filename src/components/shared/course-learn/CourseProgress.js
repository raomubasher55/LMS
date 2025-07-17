'use client';

const CourseProgress = ({ course, currentVideoId, progressData }) => {
  const calculateProgress = () => {
    if (!course?.chapters?.length) return 0;
    
    // Use real progress data if available
    if (progressData?.overallProgress !== undefined) {
      return progressData.overallProgress;
    }
    
    const totalChapters = course.chapters.length;
    if (totalChapters === 0) return 0;
    
    const completedChapters = course.chapters.filter(chapter => {
      return chapter.videos?.some(video => video.isCompleted);
    }).length;
    
    return Math.round((completedChapters / totalChapters) * 100);
  };

  const getStats = () => {
    if (!course?.chapters?.length) return { total: 0, completed: 0, remaining: 0 };
    
    // Use real progress data if available
    if (progressData) {
      const totalVideos = progressData.totalVideos || course.chapters.length;
      const completedVideos = progressData.completedChapters?.length || 0;
      return {
        total: totalVideos,
        completed: completedVideos,
        remaining: totalVideos - completedVideos
      };
    }
    
    // Fallback to counting videos from course data
    const totalVideos = course.chapters.reduce((total, chapter) => {
      return total + (chapter.videos?.length || 0);
    }, 0);
    
    const completedVideos = course.chapters.reduce((total, chapter) => {
      return total + (chapter.videos?.filter(video => video.isCompleted).length || 0);
    }, 0);
    
    return {
      total: totalVideos,
      completed: completedVideos,
      remaining: totalVideos - completedVideos
    };
  };

  const progress = calculateProgress();
  const stats = getStats();

  return (
    <div className="course-progress bg-white rounded-lg p-4 border border-gray-200 mb-6">
      <div className="progress-header mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Progress</h3>
        <div className="progress-bar-container">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Course Completion</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="progress-bar w-full bg-gray-200 rounded-full h-3">
            <div 
              className="progress-fill bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                background: progress > 0 ? 'linear-gradient(to right, #3b82f6, #2563eb)' : 'transparent'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="progress-stats grid grid-cols-3 gap-4">
        <div className="stat-item text-center">
          <div className="stat-number text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="stat-label text-sm text-gray-600">Total Videos</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-number text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="stat-label text-sm text-gray-600">Completed</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-number text-2xl font-bold text-orange-600">{stats.remaining}</div>
          <div className="stat-label text-sm text-gray-600">Remaining</div>
        </div>
      </div>
      
      {progress === 100 && (
        <div className="completion-message mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <i className="icofont-trophy text-green-600 text-2xl mb-2"></i>
          <p className="text-green-800 font-medium">Congratulations! You've completed this course!</p>
          <p className="text-green-600 text-sm mt-1">You can now download your certificate</p>
        </div>
      )}
    </div>
  );
};

export default CourseProgress;