"use client";
import TranslatedText from "@/components/shared/TranslatedText";
import Image from "next/image";

const WithdrawalRequestsList = ({ 
  requests, 
  currentPage, 
  totalPages, 
  filters, 
  onFilterChange, 
  onPageChange, 
  onViewDetails,
  onStatusUpdate 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      under_review: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    
    const displayStatus = status.replace('_', ' ').toUpperCase();
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status] || statusConfig.pending}`}>
        {displayStatus}
      </span>
    );
  };

  const getQuickActions = (request) => {
    switch (request.status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusUpdate(request._id, 'under_review')}
              className="text-blue-600 hover:text-blue-900 text-xs"
            >
              <TranslatedText>Examiner</TranslatedText>
            </button>
            <button
              onClick={() => onStatusUpdate(request._id, 'approved')}
              className="text-green-600 hover:text-green-900 text-xs"
            >
              <TranslatedText>Approuver</TranslatedText>
            </button>
            <button
              onClick={() => onStatusUpdate(request._id, 'rejected', { rejectionReason: 'Quick rejection' })}
              className="text-red-600 hover:text-red-900 text-xs"
            >
              <TranslatedText>Rejeter</TranslatedText>
            </button>
          </div>
        );
      case 'under_review':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusUpdate(request._id, 'approved')}
              className="text-green-600 hover:text-green-900 text-xs"
            >
              <TranslatedText>Approuver</TranslatedText>
            </button>
            <button
              onClick={() => onStatusUpdate(request._id, 'rejected', { rejectionReason: 'Quick rejection' })}
              className="text-red-600 hover:text-red-900 text-xs"
            >
              <TranslatedText>Rejeter</TranslatedText>
            </button>
          </div>
        );
      case 'approved':
        return (
          <button
            onClick={() => onStatusUpdate(request._id, 'completed', { transactionId: `TXN-${Date.now()}` })}
            className="text-green-600 hover:text-green-900 text-xs"
          >
            <TranslatedText>Marquer comme terminé</TranslatedText>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by instructor..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor dark:bg-gray-700 dark:text-white"
            >
<option value="all"><TranslatedText>Tous les statuts</TranslatedText></option>
<option value="pending"><TranslatedText>En attente</TranslatedText></option>
<option value="under_review"><TranslatedText>En cours d'examen</TranslatedText></option>
<option value="approved"><TranslatedText>Approuvé</TranslatedText></option>
<option value="completed"><TranslatedText>Terminé</TranslatedText></option>
<option value="rejected"><TranslatedText>Rejeté</TranslatedText></option>

            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
<tr>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
    <TranslatedText>Instructeur</TranslatedText>
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
    <TranslatedText>Montant</TranslatedText>
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
    <TranslatedText>Méthode de paiement</TranslatedText>
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
    <TranslatedText>Statut</TranslatedText>
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
    <TranslatedText>Date de demande</TranslatedText>
  </th>
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
    <TranslatedText>Actions</TranslatedText>
  </th>
</tr>

          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-4">💰</div>
<h3 className="text-lg font-medium mb-2">
  <TranslatedText>Aucune demande de retrait trouvée</TranslatedText>
</h3>
<p>
  <TranslatedText>Aucune demande de retrait ne correspond à vos filtres actuels.</TranslatedText>
</p>

                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {request.instructor?.profileImage ? (
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={`${process.env.NEXT_PUBLIC_API_URL}${request.instructor.profileImage}`}
                            alt={request.instructor.name}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <i className="icofont-business-man-alt-2 text-gray-600 dark:text-gray-400"></i>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.instructor?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.instructor?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(request.amount)}
                    </div>
                    {request.fees > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Fees: {formatCurrency(request.fees)}
                      </div>
                    )}
                    {request.netAmount && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Net: {formatCurrency(request.netAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {request.paymentMethod.replace('_', ' ').toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(request.requestDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => onViewDetails(request)}
                        className="text-primaryColor hover:text-primaryColor/80"
                      >
                        View Details
                      </button>
                      {getQuickActions(request)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequestsList;