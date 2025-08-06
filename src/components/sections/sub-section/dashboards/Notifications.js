"use client";
import { useState, useEffect } from "react";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import Image from "next/image";
import Link from "next/link";
import dashboardProdileImage from "@/assets/images/dashbord/profile.png";
import dashboardLockImage from "@/assets/images/dashbord/lock.png";
import dashboardVerifyImage from "@/assets/images/dashbord/verify.png";
import dashboardSuccessImage from "@/assets/images/dashbord/success.png";
import dashboardVideoImage from "@/assets/images/dashbord/video.png";
import TranslatedText from "@/components/shared/TranslatedText";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchNotifications = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) throw new Error("Authentication required");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        setNotifications(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    intervalId = setInterval(fetchNotifications, 30000);

    return () => clearInterval(intervalId);

  }, []);

  const getNotificationImage = (type) => {
    switch (type) {
      case "profile_update":
        return dashboardProdileImage;
      case "security":
        return dashboardLockImage;
      case "application":
        return dashboardVerifyImage;
      case "course":
        return dashboardSuccessImage;
      case "video":
        return dashboardVideoImage;
      default:
        return dashboardProdileImage;
    }
  };

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
        <HeadingDashboard path="/notifications"><TranslatedText>Notifications</TranslatedText></HeadingDashboard>
        <div className="flex justify-center py-10">
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
        <HeadingDashboard path="/notifications"><TranslatedText>Notifications</TranslatedText></HeadingDashboard>
        <div className="text-red-500 p-4">
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          {(typeof error === 'string' ? error : error?.message || '').includes("Authentication") && (
            <Link
              href="/login"
              className="block mt-2 text-blue-500 hover:underline"
            >
              <TranslatedText>Veuillez vous connecter</TranslatedText>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 max-h-137.5 overflow-auto">
      <HeadingDashboard path="/notifications">Notifications</HeadingDashboard>

      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification, idx) => (
            <li
              key={notification._id}
              className={`flex items-center flex-wrap ${
                idx === notifications.length - 1
                  ? "pt-15px"
                  : "py-15px border-b border-borderColor dark:border-borderColor-dark"
              }`}
            >
              <div className="max-w-full md:max-w-1/5 pr-5">
                <Image
                  src={getNotificationImage(notification.type)}
                  alt={notification.type}
                  width={50}
                  height={50}
                  className="max-w-50px w-full"
                />
              </div>
              <div className="max-w-full md:max-w-4/5 pr-10px">
                <div>
                  <h5 className="text-lg leading-1 font-bold text-contentColor dark:text-contentColor-dark mb-5px">
                    <Link
                      className="hover:text-primaryColor"
                      href={
                        notification.courseId
                          ? `/courses/${notification.courseId}`
                          : notification.link || "#"
                      }
                    >
                      {notification.name
                        ? `${notification.name} - ${notification.title}`
                        : notification.title}
                    </Link>
                  </h5>

                  <div className="text-darkblack dark:text-darkblack-dark leading-1.8">
                    <p>
                      {new Date(notification.createdAt).toLocaleTimeString()} -{" "}
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="py-4 text-center text-gray-500">
            No notifications available
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
