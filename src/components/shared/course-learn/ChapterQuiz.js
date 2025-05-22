'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useSweetAlert from '@/hooks/useSweetAlert';

const ChapterQuiz = ({ courseId, chapterId, quizzes, onQuizCompleted }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const createAlert = useSweetAlert();

  // Debug logging removed

  useEffect(() => {
    checkQuizStatus();
  }, [chapterId]);

  const checkQuizStatus = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz/status/${courseId}/${chapterId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && response.data.completed) {
        setQuizCompleted(true);
        setScore(response.data.score || 0);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz/submit`,
        {
          courseId,
          chapterId,
          answers: finalAnswers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const finalScore = response.data.score;
        setScore(finalScore);
        setShowResult(true);
        setQuizCompleted(true);
        
        if (finalScore >= 70) { // 70% passing grade
          createAlert('success', `Quiz completed! Score: ${finalScore}%`);
          onQuizCompleted && onQuizCompleted(chapterId, finalScore);
        } else {
          createAlert('error', `Quiz failed. Score: ${finalScore}%. You need 70% to pass.`);
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      createAlert('error', 'Failed to submit quiz');
    }
  };

  const retakeQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setAnswers([]);
    setQuizCompleted(false);
  };

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
          <div className={`text-4xl mb-4 ${score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
            {score >= 70 ? '🎉' : '😞'}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {score >= 70 ? 'Quiz Passed!' : 'Quiz Failed'}
          </h3>
          <p className="text-lg mb-4">Your Score: <span className="font-bold">{score}%</span></p>
          <p className="text-gray-600 mb-6">
            {score >= 70 ? 'Great job! You can now proceed to the next chapter.' : 'You need 70% to pass. Please try again.'}
          </p>
          {score < 70 && (
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
    return (
      <div className="quiz-completed bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center">
          <div className="text-green-500 mr-3">✅</div>
          <div>
            <p className="font-medium text-green-800">Quiz Completed</p>
            <p className="text-sm text-green-600">Score: {score}%</p>
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