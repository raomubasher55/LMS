"use client";
import { useState } from "react";
import Image from "next/image";
import TranslatedText from "@/components/shared/TranslatedText";

const WithdrawalDetailsModal = ({ request, onClose, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: request.status,
    adminNotes: request.adminNotes || '',
    rejectionReason: request.rejectionReason || '',
    transactionId: request.transactionId || '',
    fees: request.fees || 0
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await onStatusUpdate(request._id, formData.status, {
        adminNotes: formData.adminNotes,
        rejectionReason: formData.rejectionReason,
        transactionId: formData.transactionId,
        fees: parseFloat(formData.fees) || 0
      });
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-600",
      under_review: "text-blue-600",
      approved: "text-green-600",
      completed: "text-green-600",
      rejected: "text-red-600"
    };
    return colors[status] || "text-gray-600";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              <TranslatedText>Détails de la demande de retrait</TranslatedText>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Request Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                 <TranslatedText>Informations sur la demande</TranslatedText>
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400"><TranslatedText>Montant</TranslatedText>:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(request.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400"><TranslatedText>Méthode de paiement</TranslatedText>:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {request.paymentMethod.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400"><TranslatedText>Date de la demande</TranslatedText>:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(request.requestDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400"><TranslatedText>Statut</TranslatedText>:</span>
                    <span className={`font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {request.processedDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400"><TranslatedText>Date de traitement</TranslatedText>:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(request.processedDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructor Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  <TranslatedText>Informations sur l'instructeur</TranslatedText>
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    {request.instructor?.profileImage ? (
                      <Image
                        className="h-16 w-16 rounded-full object-cover"
                        src={`${process.env.NEXT_PUBLIC_API_URL}${request.instructor.profileImage}`}
                        alt={request.instructor.name}
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <i className="icofont-business-man-alt-2 text-gray-600 dark:text-gray-400 text-2xl"></i>
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {request.instructor?.name || 'Unknown'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.instructor?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Bank Account Details
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Account Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {request.bankDetails?.accountName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Account Number:</span>
                    <span className="font-medium text-gray-900 dark:text-white font-mono">
                      {request.bankDetails?.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Bank Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {request.bankDetails?.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Account Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {request.bankDetails?.accountType?.toUpperCase()}
                    </span>
                  </div>
                  {request.bankDetails?.routingNumber && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Routing Number:</span>
                      <span className="font-medium text-gray-900 dark:text-white font-mono">
                        {request.bankDetails.routingNumber}
                      </span>
                    </div>
                  )}
                  {request.bankDetails?.swiftCode && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">SWIFT Code:</span>
                      <span className="font-medium text-gray-900 dark:text-white font-mono">
                        {request.bankDetails.swiftCode}
                      </span>
                    </div>
                  )}
                  {request.bankDetails?.branchAddress && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Branch Address:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {request.bankDetails.branchAddress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Admin Actions */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Admin Actions
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                      placeholder="Enter transaction ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Processing Fees ($)
                    </label>
                    <input
                      type="number"
                      name="fees"
                      value={formData.fees}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      name="adminNotes"
                      value={formData.adminNotes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                      placeholder="Add any notes about this withdrawal..."
                    />
                  </div>

                  {formData.status === 'rejected' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rejection Reason
                      </label>
                      <textarea
                        name="rejectionReason"
                        value={formData.rejectionReason}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
                        placeholder="Explain why this withdrawal was rejected..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Net Amount Calculation */}
              {formData.fees > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Withdrawal Amount:</span>
                      <span>{formatCurrency(request.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fees:</span>
                      <span>-{formatCurrency(formData.fees)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Net Amount:</span>
                      <span>{formatCurrency(request.amount - parseFloat(formData.fees))}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalDetailsModal;