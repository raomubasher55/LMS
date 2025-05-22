"use client";
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/user-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        setError('Failed to load order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError('Error loading order history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'failed': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || statusClasses.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Action handlers
  const downloadReceipt = (order) => {
    // Generate and download receipt
    const receiptData = {
      orderNumber: order.orderNumber || order._id.slice(-8).toUpperCase(),
      date: formatDate(order.createdAt),
      items: order.items,
      total: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      transactionId: order.transactionId
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
          ${receiptData.transactionId ? `<p><strong>Transaction ID:</strong> ${receiptData.transactionId}</p>` : ''}
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
            ${receiptData.items.map(item => `
              <tr>
                <td>${item.courseName || item.name}</td>
                <td>${item.instructorName || 'N/A'}</td>
                <td>$${item.price?.toFixed(2) || '0.00'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          <p>Total: $${receiptData.total?.toFixed(2) || '0.00'}</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receiptData.orderNumber}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const retryPayment = async (order) => {
    try {
      // Redirect to payment page with order details
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/retry-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: order._id,
          items: order.items
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      } else {
        alert('Failed to retry payment. Please try again.');
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
      alert('Error occurred while retrying payment.');
    }
  };

  const viewOrderDetails = (order) => {
    // Show detailed order information in a modal or alert
    const details = `
Order Details:
--------------
Order Number: ${order.orderNumber || order._id.slice(-8).toUpperCase()}
Date: ${formatDate(order.createdAt)}
Status: ${order.status}
Total: $${order.totalAmount?.toFixed(2) || '0.00'}

Items:
${order.items?.map(item => `- ${item.courseName || item.name}: $${item.price?.toFixed(2) || '0.00'}`).join('\n')}

Payment Information:
Payment Method: ${order.paymentMethod || 'N/A'}
${order.transactionId ? `Transaction ID: ${order.transactionId}` : ''}
    `;
    
    alert(details);
  };

  const accessCourses = (order) => {
    // Navigate to enrolled courses or specific course
    if (order.items && order.items.length === 1 && order.items[0].courseId) {
      // Single course - go directly to course
      window.location.href = `/course/${order.items[0].courseId}`;
    } else {
      // Multiple courses - go to enrolled courses page
      window.location.href = '/dashboards/student-enrolled-courses';
    }
  };

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          Order History
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View all your course purchases and payment history
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {typeof error === 'string' ? error : error?.message || 'An error occurred'}</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No orders yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't made any course purchases yet.
          </p>
          <a 
            href="/courses" 
            className="inline-block bg-primaryColor hover:bg-primaryColor/90 text-white px-6 py-3 rounded-md font-medium"
          >
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
                    Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.status)}
                  <p className="text-lg font-bold text-blackColor dark:text-blackColor-dark mt-1">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-medium text-blackColor dark:text-blackColor-dark">Items:</h4>
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primaryColor/10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-primaryColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-medium text-blackColor dark:text-blackColor-dark">
                          {item.courseName || item.name || 'Course'}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.instructorName ? `by ${item.instructorName}` : 'Digital Course'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blackColor dark:text-blackColor-dark">
                        ${item.price?.toFixed(2) || '0.00'}
                      </p>
                      {item.quantity && item.quantity > 1 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="text-blackColor dark:text-blackColor-dark">
                    {order.paymentMethod || 'Credit Card'}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                    <span className="text-blackColor dark:text-blackColor-dark font-mono">
                      {order.transactionId}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex space-x-3">
                {order.status === 'completed' && (
                  <button 
                    onClick={() => downloadReceipt(order)}
                    className="text-primaryColor hover:text-primaryColor/80 text-sm font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Receipt
                  </button>
                )}
                {order.status === 'failed' && (
                  <button 
                    onClick={() => retryPayment(order)}
                    className="text-primaryColor hover:text-primaryColor/80 text-sm font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry Payment
                  </button>
                )}
                <button 
                  onClick={() => viewOrderDetails(order)}
                  className="text-gray-600 dark:text-gray-400 hover:text-blackColor dark:hover:text-blackColor-dark text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
                {order.items?.some(item => item.courseId) && (
                  <button 
                    onClick={() => accessCourses(order)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Access Courses
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentOrderHistory;