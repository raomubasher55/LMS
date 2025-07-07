"use client";

import React, { useState } from "react";
import axios from "axios";

export default function LessonQuizUpload({ courseId, lectureId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const addNewQuestion = () => {
    setQuizzes([
      ...quizzes,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
    ]);
    setActiveIndex(quizzes.length); // Open newly added
  };

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...quizzes];
    updated[index].question = value;
    setQuizzes(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...quizzes];
    updated[qIndex].options[optIndex] = value;
    setQuizzes(updated);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...quizzes];
    updated[qIndex].correctAnswerIndex = Number(value);
    setQuizzes(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const payload = quizzes.map((q) => ({
      courseId,
      lectureId,
      question: q.question,
      options: q.options,
      correctAnswer: q.options[q.correctAnswerIndex],
    }));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quizes/${courseId}/quiz/${lectureId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ All quizzes uploaded successfully.");
      setQuizzes([]);
      setActiveIndex(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload quizzes.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark p-6 rounded-md shadow-accordion dark:shadow-accordion-dark mt-6">
      <h2 className="text-xl font-bold mb-4 text-contentColor dark:text-contentColor-dark">
        Create Quiz Questions
      </h2>

      {quizzes.map((quiz, qIndex) => (
        <div
          key={qIndex}
          className="border-b-2 border-borderColor dark:border-borderColor-dark mb-4"
        >
          <button
            onClick={() => toggleAccordion(qIndex)}
            className="w-full text-left font-semibold text-contentColor hover:text-primaryColor py-3"
          >
            ➕ Add Question {qIndex + 1}
          </button>

          {activeIndex === qIndex && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter question"
                className="w-full border border-borderColor dark:border-borderColor-dark p-2 mb-2 rounded-md bg-transparent text-contentColor"
                value={quiz.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />

              {quiz.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  className="w-full border border-borderColor dark:border-borderColor-dark p-2 mb-2 rounded-md bg-transparent text-contentColor"
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIndex, optIndex, e.target.value)
                  }
                />
              ))}

              <label className="block mb-1 font-medium text-sm text-contentColor">
                Correct Answer
              </label>
              <select
                className="w-full border border-borderColor dark:border-borderColor-dark p-2 rounded-md bg-transparent text-contentColor"
                value={quiz.correctAnswerIndex}
                onChange={(e) =>
                  handleCorrectAnswerChange(qIndex, e.target.value)
                }
              >
                {quiz.options.map((_, i) => (
                  <option key={i} value={i}>
                    Option {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}

<button
  onClick={addNewQuestion}
  className="mb-4 bg-primaryColor hover:bg-primaryColor-dark mr-4 text-white px-4 py-2 rounded transition-colors duration-200"
>
  ➕ Add Question {quizzes.length + 1}
</button>

{quizzes.length > 0 && (
  <button
    onClick={handleSubmit}
    disabled={loading}
    className="bg-primaryColor hover:bg-primaryColor-dark text-white px-6 py-2 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? "Submitting..." : "Submit All Questions"}
  </button>
)}


      {message && <p className="mt-4 text-sm text-contentColor text-center">{message}</p>}
    </div>
  );
}
