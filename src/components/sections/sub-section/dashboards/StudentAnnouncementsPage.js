"use client";
import { useState, useEffect } from "react";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import TranslatedText from "@/components/shared/TranslatedText";

const StudentAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read

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

      // Update local state
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === announcementId
            ? { ...announcement, isRead: true }
            : announcement
        )
      );
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };

  const handleToggleExpand = (announcementId) => {
    const announcement = announcements.find((a) => a._id === announcementId);
    if (announcement && !announcement.isRead) {
      markAsRead(announcementId);
    }

    setExpandedAnnouncement(
      expandedAnnouncement === announcementId ? null : announcementId
    );
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (filter === "unread") return !announcement.isRead;
    if (filter === "read") return announcement.isRead;
    return true; // 'all'
  });

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <HeadingDashboard>
          <TranslatedText>Annonces du Cours</TranslatedText>
        </HeadingDashboard>
        <div className="animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <HeadingDashboard>
        <TranslatedText>Annonces du Cours</TranslatedText>
      </HeadingDashboard>

      {/* Filter and Stats */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-contentColor dark:text-contentColor-dark">
            {announcements.length}{" "}
            <TranslatedText>Nombre total d'annonces</TranslatedText>
          </span>
          {unreadCount > 0 && (
            <span className="bg-primaryColor text-white px-2 py-1 rounded text-sm">
              {unreadCount} <TranslatedText>Non lues</TranslatedText>
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === "all"
                ? "bg-primaryColor text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <TranslatedText>Tout</TranslatedText>
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === "unread"
                ? "bg-primaryColor text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <TranslatedText>Non lues</TranslatedText> ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filter === "read"
                ? "bg-primaryColor text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <TranslatedText>Lu</TranslatedText> (
            {announcements.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg
              className="mx-auto h-16 w-16"
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
          <h3 className="text-lg font-medium text-blackColor dark:text-blackColor-dark mb-2">
            {filter === "unread" ? (
              <TranslatedText>Aucune annonce non lue</TranslatedText>
            ) : filter === "read" ? (
              <TranslatedText>Aucune annonce lue</TranslatedText>
            ) : (
              <TranslatedText>Aucune annonce pour le moment</TranslatedText>
            )}
          </h3>

          <p className="text-contentColor dark:text-contentColor-dark">
            {filter === "all" ? (
              <TranslatedText>
                Vos instructeurs publieront ici les mises à jour du cours.
                Assurez-vous d'être inscrit à des cours pour voir les annonces.
              </TranslatedText>
            ) : (
              `Switch to "${filter === "unread" ? "All" : "All"}" to see ${
                filter === "unread" ? "all" : "all"
              } announcements.`
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div
              key={announcement._id}
              className={`border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${
                !announcement.isRead
                  ? "border-l-4 border-l-primaryColor bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
              onClick={() => handleToggleExpand(announcement._id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4
                        className={`text-lg font-semibold ${
                          !announcement.isRead
                            ? "text-primaryColor"
                            : "text-blackColor dark:text-blackColor-dark"
                        }`}
                      >
                        {announcement.title}
                        {!announcement.isRead && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primaryColor text-white">
                            New
                          </span>
                        )}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                          announcement.priority
                        )}`}
                      >
                        {announcement.priority.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="font-medium text-primaryColor">
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

                {expandedAnnouncement === announcement._id ? (
                  <div className="text-contentColor dark:text-contentColor-dark leading-relaxed border-t pt-4">
                    <div className="whitespace-pre-wrap">
                      {announcement.content}
                    </div>
                  </div>
                ) : (
                  <p className="text-contentColor dark:text-contentColor-dark">
                    {announcement.content.length > 200
                      ? `${announcement.content.substring(0, 200)}...`
                      : announcement.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAnnouncementsPage;
