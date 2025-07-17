"use client";

import TranslatedText from "@/components/shared/TranslatedText";

const WithdrawalHistory = ({ history, onRefresh }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      under_review:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      approved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    const displayStatus = status.replace("_", " ").toUpperCase();

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusConfig[status] || statusConfig.pending
        }`}
      >
        {displayStatus}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            <TranslatedText>Historique des retraits</TranslatedText>
          </h2>
          <button
            onClick={onRefresh}
            className="text-primaryColor hover:text-primaryColor/80 font-medium"
          >
            <i className="icofont-refresh mr-1"></i>
            <TranslatedText>Rafraîchir</TranslatedText>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">💰</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              <TranslatedText>Aucun retrait pour le moment</TranslatedText>
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <TranslatedText>
                Vous n'avez encore effectué aucune demande de retrait. Demandez
                votre premier retrait dès que vous avez des gains disponibles.
              </TranslatedText>
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <TranslatedText>Date de la demande</TranslatedText>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <TranslatedText>Montant</TranslatedText>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <TranslatedText>Moyen de paiement</TranslatedText>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <TranslatedText>Statut</TranslatedText>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <TranslatedText>Date de traitement</TranslatedText>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <TranslatedText>Remarques</TranslatedText>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {history.map((withdrawal) => (
                <tr
                  key={withdrawal._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(withdrawal.requestDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(withdrawal.amount)}
                    </div>
                    {withdrawal.fees > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Fees: {formatCurrency(withdrawal.fees)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {withdrawal.paymentMethod.replace("_", " ").toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(withdrawal.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {withdrawal.processedDate
                      ? formatDate(withdrawal.processedDate)
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                    {withdrawal.adminNotes && (
                      <div className="truncate" title={withdrawal.adminNotes}>
                        {withdrawal.adminNotes}
                      </div>
                    )}
                    {withdrawal.rejectionReason && (
                      <div
                        className="text-red-600 dark:text-red-400 truncate"
                        title={withdrawal.rejectionReason}
                      >
                        {withdrawal.rejectionReason}
                      </div>
                    )}
                    {withdrawal.transactionId && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {withdrawal.transactionId}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;
