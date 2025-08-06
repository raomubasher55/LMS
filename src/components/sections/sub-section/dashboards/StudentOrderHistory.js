"use client";
import TranslatedText from "@/components/shared/TranslatedText";
import { useState, useEffect } from "react";

const StudentOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/student/order-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.data || []);
        } else {
          setError(data.message || "Failed to load order history");
        }
      } else {
        setError("Failed to load order history");
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      setError("Error loading order history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      refunded:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusClasses[status] || statusClasses.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Action handlers
  const downloadReceipt = (order) => {
    // Generate and download receipt
    const receiptData = {
      orderNumber: order.orderId.toString().slice(-8).toUpperCase(),
      date: formatDate(order.orderDate),
      course: order.course,
      total: order.paymentAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      transactionId: order.transactionId,
    };

    // Create a simple receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receiptData.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .order-info { margin-bottom: 20px; }
          .items { border-collapse: collapse; width: 100%; }
          .items th, .items td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .items th { background-color: #f2f2f2; }
          .total { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Tanga Academy</h1>
          <h2>Payment Receipt</h2>
        </div>
        <div class="order-info">
          <p><strong>Order Number:</strong> ${receiptData.orderNumber}</p>
          <p><strong>Date:</strong> ${receiptData.date}</p>
          <p><strong>Status:</strong> ${receiptData.status}</p>
          <p><strong>Payment Method:</strong> ${receiptData.paymentMethod}</p>
          ${
            receiptData.transactionId
              ? `<p><strong>Transaction ID:</strong> ${receiptData.transactionId}</p>`
              : ""
          }
        </div>
        <table class="items">
          <thead>
            <tr>
              <th>Course</th>
              <th>Instructor</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${receiptData.course.title}</td>
              <td>${
                receiptData.course.instructor
                  ? `${receiptData.course.instructor.firstName} ${receiptData.course.instructor.lastName}`
                  : "N/A"
              }</td>
              <td>$${receiptData.total?.toFixed(2) || "0.00"}</td>
            </tr>
          </tbody>
        </table>
        <div class="total">
          <p>Total: $${receiptData.total?.toFixed(2) || "0.00"}</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([receiptHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${receiptData.orderNumber}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const viewOrderDetails = (order) => {
    // Show detailed order information in a modal or alert
    const details = `
Order Details:
--------------
Order Number: ${order.orderId.toString().slice(-8).toUpperCase()}
Date: ${formatDate(order.orderDate)}
Status: ${order.status}
Total: $${order.paymentAmount?.toFixed(2) || "0.00"}

Course:
- ${order.course.title}: $${order.paymentAmount?.toFixed(2) || "0.00"}

Payment Information:
Payment Method: ${order.paymentMethod || "N/A"}
${order.transactionId ? `Transaction ID: ${order.transactionId}` : ""}

Progress:
Course Progress: ${order.progress}%
${order.lastAccessed ? `Last Accessed: ${formatDate(order.lastAccessed)}` : ""}
    `;

    alert(details);
  };

  const accessCourse = (order) => {
    // Navigate to the specific course
    if (order.course && order.course._id) {
      window.location.href = `/course/${order.course._id}/learn`;
    } else {
      // Fallback to enrolled courses page
      window.location.href = "/dashboards/student-enrolled-courses";
    }
  };

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          <TranslatedText>Historique des Commandes</TranslatedText>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          <TranslatedText>
            Voir tous vos achats de cours et l'historique des paiements
          </TranslatedText>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            {typeof error === "string"
              ? error
              : error?.message || "An error occurred"}
          </span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            <TranslatedText>Aucune commande pour le moment</TranslatedText>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            <TranslatedText>
              Vous n'avez encore effectué aucun achat de cours.
            </TranslatedText>
          </p>

          <a
            href="/courses"
            className="inline-block bg-primaryColor hover:bg-primaryColor/90 text-white px-6 py-3 rounded-md font-medium"
          >
            <TranslatedText>Parcourir les Cours</TranslatedText>
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
                    Order #{order.orderId.toString().slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.status)}
                  <p className="text-lg font-bold text-blackColor dark:text-blackColor-dark mt-1">
                    ${order.paymentAmount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              {/* Course Item */}
              <div className="space-y-3">
                <h4 className="font-medium text-blackColor dark:text-blackColor-dark">
                  Cours:
                </h4>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                      {order.course.thumbnail ? (
                        <img
                          src={
                            order.course.thumbnail
                              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${order.course.thumbnail}`
                              : "/placeholder-course.jpg"
                          }
                          alt={order.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primaryColor/10 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-primaryColor"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-blackColor dark:text-blackColor-dark">
                        {order.course.title}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.course.instructor
                          ? `by ${order.course.instructor.firstName} ${order.course.instructor.lastName}`
                          : "Digital Course"}
                      </p>
                      <div className="mt-1">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primaryColor h-2 rounded-full"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.progress}% complete
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blackColor dark:text-blackColor-dark">
                      ${order.paymentAmount?.toFixed(2) || "0.00"}
                    </p>
                    {order.course.originalPrice &&
                      order.course.originalPrice !== order.paymentAmount && (
                        <p className="text-sm text-gray-500 line-through">
                          ${order.course.originalPrice?.toFixed(2)}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    <TranslatedText>Méthode de Paiement</TranslatedText>:
                  </span>
                  <span className="text-blackColor dark:text-blackColor-dark capitalize">
                    {order.paymentMethod || "Credit Card"}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      <TranslatedText>ID de Transaction</TranslatedText>:
                    </span>
                    <span className="text-blackColor dark:text-blackColor-dark font-mono text-xs">
                      {order.transactionId}
                    </span>
                  </div>
                )}
                {order.lastAccessed && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      <TranslatedText>Dernier Accès</TranslatedText>:
                    </span>
                    <span className="text-blackColor dark:text-blackColor-dark">
                      {formatDate(order.lastAccessed)}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => downloadReceipt(order)}
                  className="text-primaryColor hover:text-primaryColor/80 text-sm font-medium flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <TranslatedText>Télécharger le Reçu</TranslatedText>
                </button>
                <button
                  onClick={() => viewOrderDetails(order)}
                  className="text-gray-600 dark:text-gray-400 hover:text-blackColor dark:hover:text-blackColor-dark text-sm font-medium flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <TranslatedText>Voir les Détails</TranslatedText>
                </button>
                <button
                  onClick={() => accessCourse(order)}
                  className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <TranslatedText>Accéder au Cours</TranslatedText>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentOrderHistory;
