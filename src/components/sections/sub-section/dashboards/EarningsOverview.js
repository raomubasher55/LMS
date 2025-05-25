"use client";

const EarningsOverview = ({ earnings }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const earningsCards = [
    {
      title: "Total Earnings",
      value: earnings.totalEarnings,
      icon: "💰",
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      title: "Available Balance",
      value: earnings.availableBalance,
      icon: "💳",
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      title: "Pending Withdrawals",
      value: earnings.pendingAmount,
      icon: "⏳",
      color: "bg-yellow-500",
      textColor: "text-yellow-600"
    },
    {
      title: "Total Withdrawn",
      value: earnings.totalWithdrawn,
      icon: "✅",
      color: "bg-purple-500",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {earningsCards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.textColor} dark:text-white`}>
                {formatCurrency(card.value)}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EarningsOverview;