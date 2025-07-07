'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useSweetAlert from '@/hooks/useSweetAlert';
import CountdownTimer from './CountdownTimer';

const ChapterQuiz = ({ courseId, chapterId, quizzes, onQuizCompleted, progressData }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizRestrictions, setQuizRestrictions] = useState(null);
  const [checkingRestrictions, setCheckingRestrictions] = useState(true);
  const createAlert = useSweetAlert();

  // Check if chapter video has been completed
  const isChapterVideoCompleted = () => {
    return progressData?.completedChapters?.includes(chapterId) || false;
  };

  // Check quiz attempt restrictions
  const checkQuizRestrictions = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/attempt-allowed/${courseId}/${chapterId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setQuizRestrictions(response.data.data);
      }
    } catch (error) {
      console.error('Error checking quiz restrictions:', error);
    } finally {
      setCheckingRestrictions(false);
    }
  };

  // Debug logging removed

  useEffect(() => {
    checkQuizStatus();
    checkQuizRestrictions();
  }, [chapterId]);

  const checkQuizStatus = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/status/${courseId}/${chapterId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && response.data.completed) {
        setQuizCompleted(true);
        setScore(response.data.score || response.data.data?.bestScore || 0);
        // If quiz was completed, show results
        setShowResult(true);
      }
    } catch (error) {
      console.error('Error checking quiz status:', error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuizIndex] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer('');
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz-progress/submit`,
        {
          courseId,
          chapterId,
          answers: finalAnswers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const finalScore = response.data.data?.score || response.data.score || 0;
        setScore(finalScore);
        setShowResult(true);
        setQuizCompleted(true);
        
        // Refresh restrictions after quiz submission
        checkQuizRestrictions();
        
        if (finalScore >= 60) { // 60% passing grade
          createAlert('success', `Quiz completed! Score: ${finalScore}%`);
          onQuizCompleted && onQuizCompleted(chapterId, finalScore);
        } else {
          createAlert('error', `Quiz failed. Score: ${finalScore}%. You need 60% to pass.`);
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      createAlert('error', 'Failed to submit quiz');
    }
  };

  const retakeQuiz = async () => {
    // First check if retake is allowed
    setCheckingRestrictions(true);
    await checkQuizRestrictions();
    setCheckingRestrictions(false);
    
    // If restrictions allow, reset quiz state
    if (quizRestrictions && quizRestrictions.allowed) {
      setCurrentQuizIndex(0);
      setSelectedAnswer('');
      setShowResult(false);
      setAnswers([]);
      setQuizCompleted(false);
    }
    // If not allowed, the restriction UI will show automatically
  };

  // Check if video must be completed before quiz
  if (!isChapterVideoCompleted()) {
    return (
      <div className="quiz-container bg-yellow-50 p-6 rounded-lg text-center border border-yellow-200">
        <div className="text-yellow-600 mb-4">
          <i className="icofont-video-alt text-4xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Complete the Video First
        </h3>
        <p className="text-yellow-700">
          You must complete watching the chapter video before taking the quiz.
        </p>
      </div>
    );
  }

  // Show loading while checking restrictions
  if (checkingRestrictions) {
    return (
      <div className="quiz-container bg-gray-50 p-6 rounded-lg text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
        <p className="text-gray-600">Checking quiz availability...</p>
      </div>
    );
  }

  // Show restriction messages if quiz is not allowed
  if (quizRestrictions && !quizRestrictions.allowed) {
    if (quizRestrictions.reason === 'time_restriction') {
      return (
        <div className="quiz-container bg-orange-50 p-6 rounded-lg text-center border border-orange-200">
          <div className="text-orange-600 mb-4">
            <i className="icofont-clock-time text-4xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Quiz Temporarily Locked
          </h3>
          <p className="text-orange-700 mb-4">
            You must wait <strong>{quizRestrictions.restrictions.timeRemaining} hours</strong> before your next attempt.
          </p>
          <p className="text-sm text-orange-600 mb-4">
            Attempts: {quizRestrictions.restrictions.totalAttempts}
          </p>
          <CountdownTimer 
            targetDate={quizRestrictions.restrictions.nextAttemptAllowedAt}
            onComplete={() => checkQuizRestrictions()}
          />
        </div>
      );
    }

    if (quizRestrictions.reason === 'video_rewatch') {
      return (
        <div className="quiz-container bg-blue-50 p-6 rounded-lg text-center border border-blue-200">
          <div className="text-blue-600 mb-4">
            <i className="icofont-video-cam text-4xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Re-watch Required
          </h3>
          <p className="text-blue-700 mb-4">
            You must re-watch the chapter video completely before your next quiz attempt.
          </p>
          <p className="text-sm text-blue-600">
            Attempts: {quizRestrictions.restrictions.totalAttempts}
          </p>
        </div>
      );
    }

    if (quizRestrictions.reason === 'instructor_approval') {
      return (
        <div className="quiz-container bg-red-50 p-6 rounded-lg text-center border border-red-200">
          <div className="text-red-600 mb-4">
            <i className="icofont-teacher text-4xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Instructor Approval Required
          </h3>
          <p className="text-red-700 mb-4">
            You've reached the maximum number of attempts. Please contact your instructor for approval to continue.
          </p>
          <p className="text-sm text-red-600">
            Total Attempts: {quizRestrictions.restrictions.totalAttempts}
          </p>
        </div>
      );
    }
  }

  // Add proper validation for quizzes
  if (!quizzes || !Array.isArray(quizzes) || quizzes.length === 0) {
    return (
      <div className="quiz-container bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">No quiz available for this chapter.</p>
      </div>
    );
  }

  if (quizCompleted && showResult) {
    return (
      <div className="quiz-result bg-white p-6 rounded-lg border">
        <div className="text-center">
          <div className={`text-4xl mb-4 ${score >= 60 ? 'text-green-500' : 'text-red-500'}`}>
            {score >= 60 ? '🎉' : '😞'}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {score >= 60 ? 'Quiz Passed!' : 'Quiz Failed'}
          </h3>
          <p className="text-lg mb-4">Your Score: <span className="font-bold">{score}%</span></p>
          <p className="text-gray-600 mb-6">
            {score >= 60 ? 'Great job! You can now proceed to the next chapter.' : 'You need 60% to pass. Please try again.'}
          </p>
          {score < 60 && (
            <button
              onClick={retakeQuiz}
              className="bg-primaryColor text-white px-6 py-2 rounded-lg hover:bg-primaryColor/90"
            >
              Retake Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  if (quizCompleted && !showResult) {
    // This should show the actual result if quiz was completed
    // Force showing result if we have a score
    if (score > 0) {
      return (
        <div className="quiz-result bg-white p-6 rounded-lg border">
          <div className="text-center">
            <div className={`text-4xl mb-4 ${score >= 60 ? 'text-green-500' : 'text-red-500'}`}>
              {score >= 60 ? '🎉' : '😞'}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {score >= 60 ? 'Quiz Passed!' : 'Quiz Failed'}
            </h3>
            <p className="text-lg mb-4">Your Score: <span className="font-bold">{score}%</span></p>
            <p className="text-gray-600 mb-6">
              {score >= 60 ? 'Great job! You can now proceed to the next chapter.' : 'You need 60% to pass. Please try again.'}
            </p>
            {score < 60 && (
              <button
                onClick={retakeQuiz}
                className="bg-primaryColor text-white px-6 py-2 rounded-lg hover:bg-primaryColor/90"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className={`quiz-completed p-4 rounded-lg border ${score >= 60 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center">
          <div className={`mr-3 ${score >= 60 ? 'text-green-500' : 'text-red-500'}`}>
            {score >= 60 ? '✅' : '❌'}
          </div>
          <div>
            <p className={`font-medium ${score >= 60 ? 'text-green-800' : 'text-red-800'}`}>
              Quiz {score >= 60 ? 'Passed' : 'Failed'}
            </p>
            <p className={`text-sm ${score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
              Score: {score}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentQuizIndex];

  // Add validation for current quiz
  if (!currentQuiz || !currentQuiz.options || !Array.isArray(currentQuiz.options)) {
    return (
      <div className="quiz-container bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">Quiz data is incomplete. Please contact the instructor.</p>
      </div>
    );
  }

  return (
    <div className="quiz-container bg-white p-6 rounded-lg border">
      <div className="quiz-header mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Chapter Quiz</h3>
          <span className="text-sm text-gray-500">
            Question {currentQuizIndex + 1} of {quizzes.length}
          </span>
        </div>
        <div className="progress-bar w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-primaryColor h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuizIndex + 1) / quizzes.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="question-section mb-6">
        <h4 className="text-lg font-medium mb-4">{currentQuiz.question}</h4>
        <div className="options space-y-3">
          {currentQuiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 border rounded-lg transition-all ${
                selectedAnswer === option
                  ? 'border-primaryColor bg-primaryColor/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-actions">
        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className={`px-6 py-3 rounded-lg font-medium ${
            selectedAnswer
              ? 'bg-primaryColor text-white hover:bg-primaryColor/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentQuizIndex < quizzes.length - 1 ? 'Next Question' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default ChapterQuiz;