"use client";
import { useState, useEffect } from "react";
import useAssignmentSubmissions from "@/hooks/useAssignmentSubmissions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";
import TranslatedText from "@/components/shared/TranslatedText";

const StudentAssignmentsContent = ({ courseId }) => {
  const { submissions, loading, error } = useAssignmentSubmissions(courseId);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Handle file selection
  const handleFileChange = (e) => {
    setSubmissionFiles(Array.from(e.target.files));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAssignment) {
      toast.error("Please select an assignment");
      return;
    }

    if (submissionFiles.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      submissionFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("comment", comment);

      // Submit the assignment
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/submissions/${selectedAssignment.assignment._id}/submit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Assignment submitted successfully");
        setSelectedAssignment(null);
        setSubmissionFiles([]);
        setComment("");
        // Refresh the page to show updated submissions
        router.refresh();
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Format due date
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Determine if an assignment is overdue
  const isOverdue = (dateString) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    return dueDate < now;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
        <strong className="font-bold">
          <TranslatedText>COURS INSCRITS</TranslatedText>!
        </strong>
        <span className="block sm:inline">
          {" "}
          {error?.message || String(error)}
        </span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">
        <TranslatedText>Devoirs du cours</TranslatedText>
      </h2>

      {submissions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            <TranslatedText>Aucun devoir trouvé pour ce cours.</TranslatedText>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {submissions.map((item) => (
            <div
              key={item.assignment._id}
              className="border dark:border-gray-700 rounded-lg overflow-hidden shadow-md p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{item.assignment.title}</h3>
                <div className="flex items-center">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      isOverdue(item.assignment.dueDate) && !item.submission
                        ? "bg-red-100 text-red-800"
                        : item.submission?.status === "graded"
                        ? "bg-green-100 text-green-800"
                        : item.submission
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {isOverdue(item.assignment.dueDate) && !item.submission ? (
                      <TranslatedText>En retard</TranslatedText>
                    ) : item.submission?.status === "graded" ? (
                      <TranslatedText>Noté</TranslatedText>
                    ) : item.submission ? (
                      <TranslatedText>Soumis</TranslatedText>
                    ) : (
                      <TranslatedText>Non soumis</TranslatedText>
                    )}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Due Date:</strong>{" "}
                  <span
                    className={
                      isOverdue(item.assignment.dueDate) && !item.submission
                        ? "text-red-600"
                        : ""
                    }
                  >
                    {formatDueDate(item.assignment.dueDate)}
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Points:</strong> {item.assignment.maxPoints}
                </p>
              </div>

              {/* Submission Status and Details */}
              {item.submission ? (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="text-sm mb-2">
                    <strong>
                      <TranslatedText>Soumis</TranslatedText>:
                    </strong>{" "}
                    {new Date(item.submission.submittedAt).toLocaleString()}
                  </p>

                  {item.submission.status === "graded" && (
                    <div className="mt-2 border-t pt-2 border-gray-200 dark:border-gray-700">
                      <p className="text-sm">
                        <strong>
                          <TranslatedText>Note</TranslatedText>:
                        </strong>{" "}
                        {item.submission.grade.points} /{" "}
                        {item.assignment.maxPoints}
                      </p>
                      {item.submission.grade.feedback && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">
                            <TranslatedText>Retour</TranslatedText>:
                          </p>
                          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                            {item.submission.grade.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedAssignment(item)}
                    className="mt-3 text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    <TranslatedText>Voir la soumission</TranslatedText>
                  </button>

                  {item.submission.status === "resubmit" && (
                    <button
                      onClick={() => setSelectedAssignment(item)}
                      className="mt-3 ml-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      <TranslatedText>Soumettre à nouveau</TranslatedText>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSelectedAssignment(item)}
                  className={`text-sm px-4 py-2 rounded ${
                    isOverdue(item.assignment.dueDate)
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isOverdue(item.assignment.dueDate) ? (
                    <TranslatedText>Soumettre en retard</TranslatedText>
                  ) : (
                    <TranslatedText>Soumettre le devoir</TranslatedText>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {selectedAssignment.submission ? (
                    <TranslatedText>Voir la soumission</TranslatedText>
                  ) : (
                    <TranslatedText>Soumettre le devoir</TranslatedText>
                  )}
                </h3>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-lg mb-2">
                  {selectedAssignment.assignment.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>
                    <TranslatedText>Date d'échéance</TranslatedText>:
                  </strong>{" "}
                  {formatDueDate(selectedAssignment.assignment.dueDate)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Points:</strong>{" "}
                  {selectedAssignment.assignment.maxPoints}
                </p>
              </div>

              {selectedAssignment.submission ? (
                <div>
                  <div className="mb-6">
                    <h4 className="font-bold mb-2">
                      <TranslatedText>Détails de la soumission</TranslatedText>
                    </h4>
                    <p className="text-sm mb-2">
                      <strong>
                        <TranslatedText>Soumis</TranslatedText>:
                      </strong>{" "}
                      {new Date(
                        selectedAssignment.submission.submittedAt
                      ).toLocaleString()}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>
                        <TranslatedText>Statut</TranslatedText>:
                      </strong>{" "}
                      <span
                        className={`px-2 py-1 rounded ${
                          selectedAssignment.submission.status === "graded"
                            ? "bg-green-100 text-green-800"
                            : selectedAssignment.submission.status ===
                              "submitted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedAssignment.submission.status
                          .charAt(0)
                          .toUpperCase() +
                          selectedAssignment.submission.status.slice(1)}
                      </span>
                    </p>

                    {selectedAssignment.submission.status === "graded" && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <h4 className="font-bold mb-2">
                          <TranslatedText>Note</TranslatedText>
                        </h4>
                        <p className="text-sm mb-2">
                          <strong>Points:</strong>{" "}
                          {selectedAssignment.submission.grade.points} /{" "}
                          {selectedAssignment.assignment.maxPoints}
                        </p>
                        {selectedAssignment.submission.grade.feedback && (
                          <div>
                            <p className="text-sm font-medium">
                              <TranslatedText>Retour</TranslatedText>:
                            </p>
                            <p className="text-sm mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                              {selectedAssignment.submission.grade.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* View files functionality would go here */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-2">Files</h4>
                    {/* This would need to be populated with the actual files */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <TranslatedText>
                        Les fichiers seront disponibles pour consultation ici.
                      </TranslatedText>
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedAssignment(null)}
                      className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      <TranslatedText>Fermer</TranslatedText>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label
                      htmlFor="files"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <TranslatedText>Téléverser des fichiers</TranslatedText>
                    </label>
                    <input
                      type="file"
                      id="files"
                      multiple
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <TranslatedText>
                        Téléversez des fichiers PDF, Word, Excel, PowerPoint,
                        des images ou des fichiers zip. Maximum 5 fichiers,
                        50 Mo par fichier.
                      </TranslatedText>
                    </p>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <TranslatedText>Commentaire (optionnel)</TranslatedText>
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                      rows={4}
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(null)}
                      className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      <TranslatedText>Annuler</TranslatedText>
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || submissionFiles.length === 0}
                      className={`text-sm px-4 py-2 rounded ${
                        submitting || submissionFiles.length === 0
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      {submitting ? (
                        <TranslatedText>Soumission en cours...</TranslatedText>
                      ) : (
                        <TranslatedText>Soumettre le devoir</TranslatedText>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentsContent;
