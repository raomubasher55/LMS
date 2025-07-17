"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import TranslatedText from "../TranslatedText";

const AssignmentSubmissions = ({ assignmentId, assignmentTitle, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({});
  const [gradingData, setGradingData] = useState({});

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/assignment/${assignmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSubmissions(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleGradeSubmission = async (submissionId) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const gradeData = gradingData[submissionId];

      if (!gradeData?.points || gradeData.points === "") {
        alert("Please enter points");
        return;
      }

      setGrading((prev) => ({ ...prev, [submissionId]: true }));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/${submissionId}/grade`,
        {
          points: parseInt(gradeData.points),
          feedback: gradeData.feedback || "",
          status: gradeData.status || "graded",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update the submission in the list
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub._id === submissionId
              ? {
                  ...sub,
                  grade: {
                    points: parseInt(gradeData.points),
                    feedback: gradeData.feedback,
                  },
                }
              : sub
          )
        );

        // Clear grading data
        setGradingData((prev) => ({
          ...prev,
          [submissionId]: { points: "", feedback: "" },
        }));
        alert("Assignment graded successfully!");
      }
    } catch (error) {
      console.error("Error grading submission:", error);
      alert("Failed to grade submission");
    } finally {
      setGrading((prev) => ({ ...prev, [submissionId]: false }));
    }
  };

  const handleGradingInputChange = (submissionId, field, value) => {
    setGradingData((prev) => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor"></div>
            <p className="ml-2">Loading submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-whiteColor-dark rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blackColor dark:text-blackColor-dark">
            <TranslatedText>Soumissions pour</TranslatedText>: {assignmentTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-contentColor dark:text-contentColor-dark">
              <TranslatedText>
                Aucune soumission trouvée pour cette tâche.
              </TranslatedText>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-blackColor dark:text-blackColor-dark">
                      {submission.student.firstName}{" "}
                      {submission.student.lastName}
                    </h4>
                    <p className="text-sm text-contentColor dark:text-contentColor-dark">
                      <TranslatedText>Nom d'utilisateur</TranslatedText>:{" "}
                      {submission.student.username}
                    </p>
                    <p className="text-sm text-contentColor dark:text-contentColor-dark">
                      <TranslatedText>Soumis</TranslatedText>:{" "}
                      {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.grade
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {submission.grade ? "Graded" : "Pending Grade"}
                    </span>
                  </div>
                </div>

                {submission.comment && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-blackColor dark:text-blackColor-dark">
                      <TranslatedText>Commentaire de l'étudiant</TranslatedText>
                      :
                    </p>
                    <p className="text-sm text-contentColor dark:text-contentColor-dark bg-gray-50 p-2 rounded">
                      {submission.comment}
                    </p>
                  </div>
                )}

                {submission.files && submission.files.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2">
                      <TranslatedText>Fichiers soumis</TranslatedText>:
                    </p>
                    <div className="space-y-2">
                      {submission.files.map((file, index) => (
                        <a
                          key={index}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <span className="mr-2">📄</span>
                          {file.originalname || file.filename || "Unknown file"}
                          <span className="ml-2 text-xs text-gray-500">
                            (
                            {file.size && !isNaN(file.size)
                              ? (file.size / 1024).toFixed(1)
                              : "0"}{" "}
                            KB)
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {submission.grade &&
                submission.grade.points !== undefined &&
                submission.grade.points !== null ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Grade:</span>
                      <span className="font-bold text-green-800">
                        {submission.grade.points} points
                      </span>
                    </div>
                    {submission.grade.feedback && (
                      <div>
                        <span className="font-medium text-green-800">
                          <TranslatedText>Retour d'information</TranslatedText>:
                        </span>
                        <p className="text-green-700 mt-1">
                          {submission.grade.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blackColor dark:text-blackColor-dark mb-3">
                      <TranslatedText>Noter la soumission</TranslatedText>
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-1">
                          Points
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Enter points"
                          value={gradingData[submission._id]?.points || ""}
                          onChange={(e) =>
                            handleGradingInputChange(
                              submission._id,
                              "points",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded text-blackColor dark:text-blackColor-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-1">
                          <TranslatedText>Retour d'information</TranslatedText>{" "}
                          (Optional)
                        </label>
                        <textarea
                          placeholder="Enter feedback"
                          value={gradingData[submission._id]?.feedback || ""}
                          onChange={(e) =>
                            handleGradingInputChange(
                              submission._id,
                              "feedback",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded text-blackColor dark:text-blackColor-dark"
                          rows="2"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-1">
                        Status
                      </label>
                      <select
                        value={gradingData[submission._id]?.status || "graded"}
                        onChange={(e) =>
                          handleGradingInputChange(
                            submission._id,
                            "status",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded text-blackColor dark:text-blackColor-dark"
                      >
                        <TranslatedText>Corrigé (Final)</TranslatedText>
                        <TranslatedText>
                          Demander une nouvelle soumission
                        </TranslatedText>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Sélectionnez "Demander une nouvelle soumission" pour
                        autoriser l'étudiant à soumettre à nouveau
                      </p>
                    </div>
                    <button
                      onClick={() => handleGradeSubmission(submission._id)}
                      disabled={grading[submission._id]}
                      className={`mt-3 px-4 py-2 rounded font-medium text-sm ${
                        grading[submission._id]
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primaryColor text-white hover:bg-primaryColor/90"
                      }`}
                    >
                      {grading[submission._id] ? (
                        <TranslatedText>Évaluation en cours...</TranslatedText>
                      ) : (
                        <TranslatedText>Soumettre la note</TranslatedText>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentSubmissions;
