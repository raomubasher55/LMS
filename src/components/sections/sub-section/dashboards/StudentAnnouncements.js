"use client";
import TranslatedText from "@/components/shared/TranslatedText";
import { useState, useEffect } from "react";

const StudentAnnouncements = () => {
  console.log("StudentAnnouncements component rendering...");

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found for student announcements");
        setLoading(false);
        return;
      }

      console.log("Fetching student announcements...");
      const response = await fetch(
        "http://localhost:5000/api/announcements/student/announcements",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Student announcements response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Student announcements data:", data);
        setAnnouncements(data.data || []);
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to fetch announcements:",
          response.status,
          errorText
        );
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const markAsRead = async (announcementId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:5000/api/announcements/announcements/${announcementId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };

  const handleToggleExpand = (announcementId) => {
    if (!announcements.find((a) => a._id === announcementId)?.isRead) {
      markAsRead(announcementId);
    }

    setExpandedAnnouncement(
      expandedAnnouncement === announcementId ? null : announcementId
    );
  };

  if (loading) {
    return (
      <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-30px">
        <h3 className="text-size-22 font-bold text-blackColor dark:text-blackColor-dark leading-30px mb-25px">
          <TranslatedText>Annonces du Cours (Chargement...)</TranslatedText>
        </h3>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-30px">
      <h3 className="text-size-22 font-bold text-blackColor dark:text-blackColor-dark leading-30px mb-25px">
        <TranslatedText>Annonces du Cours</TranslatedText> (
        {announcements.length})
      </h3>

      {announcements.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
              />
            </svg>
          </div>
          <p className="text-contentColor dark:text-contentColor-dark mb-2">
            <TranslatedText>
              Aucune annonce pour le moment. Vos instructeurs publieront ici les
              mises à jour du cours.
            </TranslatedText>
          </p>
          <p className="text-sm text-gray-500">
            <TranslatedText>
              Pour voir les annonces, vous devez être inscrit à des cours où les
              instructeurs ont publié des annonces.
            </TranslatedText>
          </p>
          <div className="mt-4 text-xs text-gray-400">
            <p>
              <TranslatedText>
                Informations de débogage : Composant chargé avec succès
              </TranslatedText>
            </p>
            <p>
              <TranslatedText>État de chargement :</TranslatedText>{" "}
              {loading ? "true" : "false"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.slice(0, 5).map((announcement) => (
            <div
              key={announcement._id}
              className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                !announcement.isRead
                  ? "border-l-4 border-l-primaryColor bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => handleToggleExpand(announcement._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4
                      className={`font-semibold ${
                        !announcement.isRead
                          ? "text-primaryColor"
                          : "text-blackColor dark:text-blackColor-dark"
                      }`}
                    >
                      {announcement.title}
                      {!announcement.isRead && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primaryColor text-white">
                          <TranslatedText>Nouveau</TranslatedText>
                        </span>
                      )}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-medium">
                      {announcement.courseId?.title}
                    </span>
                    <span>•</span>
                    <span>
                      {announcement.instructorId?.firstName}{" "}
                      {announcement.instructorId?.lastName}
                    </span>
                    <span>•</span>
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>

                  {expandedAnnouncement === announcement._id ? (
                    <div className="mt-3 text-contentColor dark:text-contentColor-dark leading-relaxed">
                      {announcement.content}
                    </div>
                  ) : (
                    <p className="text-contentColor dark:text-contentColor-dark">
                      {announcement.content.length > 150
                        ? `${announcement.content.substring(0, 150)}...`
                        : announcement.content}
                    </p>
                  )}
                </div>

                <div className="ml-4 flex-shrink-0">
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedAnnouncement === announcement._id
                        ? "transform rotate-180"
                        : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}

          {announcements.length > 5 && (
            <div className="text-center pt-4">
              <button className="text-primaryColor hover:text-primaryColor/80 font-medium text-sm">
                <TranslatedText>Voir Toutes les Annonces</TranslatedText>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAnnouncements;
