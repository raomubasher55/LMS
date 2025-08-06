"use client";
import { useState, useEffect } from "react";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import TranslatedText from "@/components/shared/TranslatedText";

const InstructorAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    courseId: "",
    priority: "medium",
  });

  // Fetch instructor courses
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/instructor-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/announcements/instructor/announcements",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchAnnouncements();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.courseId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingAnnouncement
        ? `http://localhost:5000/api/announcements/instructor/announcements/${editingAnnouncement._id}`
        : "http://localhost:5000/api/announcements/instructor/announcements";

      const method = editingAnnouncement ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          editingAnnouncement
            ? "Announcement updated successfully!"
            : "Announcement created successfully!"
        );
        setShowModal(false);
        setEditingAnnouncement(null);
        setFormData({
          title: "",
          content: "",
          courseId: "",
          priority: "medium",
        });
        fetchAnnouncements();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save announcement");
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert("Failed to save announcement");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/announcements/instructor/announcements/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Announcement deleted successfully!");
        fetchAnnouncements();
      } else {
        alert("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    }
  };

  // Handle edit
  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      courseId: announcement.courseId._id,
      priority: announcement.priority,
    });
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <HeadingDashboard>
        <TranslatedText>Annonces</TranslatedText>
      </HeadingDashboard>

      {/* Banner */}
      <div className="mb-60px py-25px px-30px bg-lightGrey7 dark:bg-lightGrey7-dark grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 rounded-md">
        <div className="xl:col-start-1 xl:col-span-8">
          <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-5px">
            <span className="leading-1.2">
              <TranslatedText>Informez tous vos étudiants</TranslatedText>.
            </span>
          </h2>
          <p className="text-contentColor dark:text-contentColor-dark leading-1.8">
            <TranslatedText>Créer une annonce</TranslatedText>
          </p>
        </div>
        <div className="xl:col-start-9 xl:col-span-4">
          <button
            onClick={() => setShowModal(true)}
            className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor rounded group text-nowrap transition-all duration-300"
          >
            <TranslatedText>Ajouter une nouvelle annonce</TranslatedText>
          </button>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead className="text-sm md:text-base text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark leading-1.8 md:leading-1.8">
            <tr>
              <th className="px-5px py-10px md:px-5">
                <TranslatedText>Date</TranslatedText>
              </th>
              <th className="px-5px py-10px md:px-5">
                <TranslatedText>Annonce</TranslatedText>
              </th>
              <th className="px-5px py-10px md:px-5">
                <TranslatedText>Priorité</TranslatedText>
              </th>
              <th className="px-5px py-10px md:px-5">
                <TranslatedText>Actions</TranslatedText>
              </th>
            </tr>
          </thead>
          <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">
            {announcements.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-8 text-contentColor dark:text-contentColor-dark"
                >
                  <TranslatedText>
                    Aucune annonce trouvée. Créez votre première annonce !
                  </TranslatedText>
                </td>
              </tr>
            ) : (
              announcements.map((announcement, index) => (
                <tr
                  key={announcement._id}
                  className={`leading-1.8 md:leading-1.8 ${
                    index % 2 === 0
                      ? ""
                      : "bg-lightGrey5 dark:bg-whiteColor-dark"
                  }`}
                >
                  <td className="px-5px py-10px md:px-5 font-normal text-wrap">
                    <span className="text-blackColor dark:text-blackColor-dark font-bold">
                      {formatDate(announcement.createdAt)}
                    </span>
                  </td>
                  <td className="px-5px py-10px md:px-5 font-normal text-wrap">
                    <span className="text-blackColor dark:text-blackColor-dark font-bold">
                      {announcement.title}
                    </span>
                    <p>Course: {announcement.courseId?.title}</p>
                    <p className="text-sm mt-1">
                      {announcement.content.substring(0, 100)}...
                    </p>
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="flex items-center gap-1 md:text-sm font-bold text-blackColor dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor px-10px leading-1.8 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <TranslatedText>Modifier</TranslatedText>
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="flex items-center gap-1 md:text-sm font-bold text-blackColor dark:text-blackColor-dark hover:text-red-600 dark:hover:text-red-400 px-10px leading-1.8 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        <TranslatedText>Supprimer</TranslatedText>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-whiteColor-dark rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-4">
              {editingAnnouncement
                ? "Edit Announcement"
                : "Create New Announcement"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2">
                  <TranslatedText>Cours</TranslatedText> *
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData({ ...formData, courseId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  required
                >
                  <option value="">
                    <TranslatedText>Sélectionnez un cours</TranslatedText>
                  </option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2">
                  <TranslatedText>Titre</TranslatedText> *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2">
                  <TranslatedText>Contenu</TranslatedText> *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  placeholder="Enter announcement content"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2">
                  <TranslatedText>Priorité</TranslatedText>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
                >
                  <option value="low">
                    <TranslatedText>Faible</TranslatedText>
                  </option>
                  <option value="medium">
                    <TranslatedText>Moyenne</TranslatedText>
                  </option>
                  <option value="high">
                    <TranslatedText>Élevée</TranslatedText>
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAnnouncement(null);
                    setFormData({
                      title: "",
                      content: "",
                      courseId: "",
                      priority: "medium",
                    });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <TranslatedText>Annuler</TranslatedText>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors duration-200"
                >
                  {editingAnnouncement ? (
                    <TranslatedText>Mettre à jour</TranslatedText>
                  ) : (
                    <TranslatedText>Créer</TranslatedText>
                  )}{" "}
                  <TranslatedText>Annonce</TranslatedText>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAnnouncements;
