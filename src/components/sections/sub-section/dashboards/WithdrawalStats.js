"use client";

import TranslatedText from "@/components/shared/TranslatedText";

const WithdrawalStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const statCards = [
    {
      title: <TranslatedText>Total des demandes</TranslatedText>,
      value: stats.totalRequests || 0,
      icon: "📋",
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
         title: <TranslatedText>Demandes en attente</TranslatedText>,
      value: stats.pendingRequests || 0,
      icon: "⏳",
      color: "bg-yellow-500",
      textColor: "text-yellow-600"
    },
    {
      title: <TranslatedText>Terminées</TranslatedText>,
      value: stats.completedRequests || 0,
      icon: "✅",
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      title: <TranslatedText>Total retiré</TranslatedText>,
      value: formatCurrency(stats.totalWithdrawn),
      icon: "💰",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      isCurrency: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {stat.title}
              </p>
              <p className={`text-2xl font-bold ${stat.textColor} dark:text-white`}>
                {stat.isCurrency ? stat.value : stat.value.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WithdrawalStats;