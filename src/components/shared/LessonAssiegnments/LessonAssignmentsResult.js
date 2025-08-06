"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AssignmentSubmissions from "../assignments/AssignmentSubmissions";
import TranslatedText from "../TranslatedText";

const LessonAssignmentsResult = ({ courseId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingSubmissions, setViewingSubmissions] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxPoints: 100
  });

    // Fetch all assignments for instructor's courses
    useEffect(() => {
        const fetchInstructorAssignments = async () => {
          try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/instructor/assignments`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setAssignments(res.data.data);
          } catch (error) {
            console.error("Failed to fetch assignments:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchInstructorAssignments();
      }, []);
    
  // Fetch assignments from backend
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${courseId}/assignments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignments(res.data.data);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchAssignments();
  }, [courseId]);

  // Handle delete assignment
  const handleDelete = async (assignmentId) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/assignments/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignments(assignments.filter(a => a._id !== assignmentId));
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  // Open edit modal
  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate.split('T')[0], // Format date for input
      maxPoints: assignment.maxPoints
    });
    setIsModalOpen(true);
  };

  // Open submissions view
  const openSubmissionsView = (assignment) => {
    setViewingSubmissions(assignment);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit updated assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/assignments/${editingAssignment._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignments(assignments.map(a => 
        a._id === editingAssignment._id ? res.data.data : a
      ));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-contentColor dark:text-contentColor-dark">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h4 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-4">
        <TranslatedText>Devoirs</TranslatedText>
      </h4>

      {assignments.length === 0 ? (
        <div className="h-40 flex items-center justify-center">
          <p className="text-contentColor dark:text-contentColor-dark"><TranslatedText>Aucun devoir trouvé</TranslatedText></p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="text-sm text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark">
              <tr>
<th className="px-4 py-3"><TranslatedText>Titre</TranslatedText></th>
<th className="px-4 py-3"><TranslatedText>Date limite</TranslatedText></th>
<th className="px-4 py-3"><TranslatedText>Points max</TranslatedText></th>
<th className="px-4 py-3"><TranslatedText>Soumissions</TranslatedText></th>
<th className="px-4 py-3"><TranslatedText>Actions</TranslatedText></th>

              </tr>
            </thead>
            <tbody className="text-contentColor dark:text-contentColor-dark">
              {assignments.map((assignment) => (
                <tr 
                  key={assignment._id}
                  className="border-b border-lightGrey5 dark:border-whiteColor-dark"
                >
                  <td className="px-4 py-3">{assignment.title}</td>
                  <td className="px-4 py-3">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{assignment.maxPoints}</td>
                  <td className="px-4 py-3">{assignment.submissionCount || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openSubmissionsView(assignment)}
                        className="px-3 py-1 bg-blue-500 text-whiteColor rounded hover:bg-opacity-90 transition text-xs"
                        title="View student submissions"
                      >
                        <TranslatedText>Voir les soumissions</TranslatedText>
                      </button>
                      <button
                        onClick={() => openEditModal(assignment)}
                        className="px-3 py-1 bg-primaryColor text-whiteColor rounded hover:bg-opacity-90 transition text-xs"
                      >
                        <TranslatedText>Modifier</TranslatedText>
                      </button>
                      <button
                        onClick={() => handleDelete(assignment._id)}
                        className="px-3 py-1 bg-secondaryColor text-whiteColor rounded hover:bg-opacity-90 transition text-xs"
                      >
                        <TranslatedText>Supprimer</TranslatedText>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-whiteColor dark:bg-whiteColor-dark rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-4">
           <TranslatedText>Modifier l’exercice</TranslatedText>
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-contentColor dark:text-contentColor-dark mb-2">
                  <TranslatedText>Titre</TranslatedText>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-blackColor dark:text-blackColor-dark bg-whiteColor dark:bg-whiteColor-dark"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-contentColor dark:text-contentColor-dark mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-blackColor dark:text-blackColor-dark bg-whiteColor dark:bg-whiteColor-dark"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-contentColor dark:text-contentColor-dark mb-2">
                 <TranslatedText>Date d’échéance</TranslatedText>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-blackColor dark:text-blackColor-dark bg-whiteColor dark:bg-whiteColor-dark"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-contentColor dark:text-contentColor-dark mb-2">
                  Max Points
                </label>
                <input
                  type="number"
                  name="maxPoints"
                  value={formData.maxPoints}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-2 border rounded text-blackColor dark:text-blackColor-dark bg-whiteColor dark:bg-whiteColor-dark"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-blackColor dark:text-blackColor-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <TranslatedText>Annuler</TranslatedText>

                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primaryColor text-whiteColor rounded hover:bg-opacity-90 transition"
                >
                  <TranslatedText>Enregistrer les modifications</TranslatedText>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Submissions Modal */}
      {viewingSubmissions && (
        <AssignmentSubmissions
          assignmentId={viewingSubmissions._id}
          assignmentTitle={viewingSubmissions.title}
          onClose={() => setViewingSubmissions(null)}
        />
      )}
    </div>
  );
};

export default LessonAssignmentsResult;