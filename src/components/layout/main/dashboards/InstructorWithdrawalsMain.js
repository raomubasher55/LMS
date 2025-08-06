"use client";
import { useState, useEffect } from "react";
import EarningsOverview from "@/components/sections/sub-section/dashboards/EarningsOverview";
import WithdrawalForm from "@/components/sections/sub-section/dashboards/WithdrawalForm";
import WithdrawalHistory from "@/components/sections/sub-section/dashboards/WithdrawalHistory";
import TranslatedText from "@/components/shared/TranslatedText";

const InstructorWithdrawalsMain = () => {
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    totalWithdrawn: 0,
    pendingAmount: 0,
    availableBalance: 0,
    withdrawalHistory: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setEarningsData(result.data);
      }
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const handleWithdrawalSuccess = () => {
    setShowWithdrawalForm(false);
    fetchEarningsData(); // Refresh data after successful withdrawal
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blackColor dark:text-white">
            <TranslatedText>Retraits de paiement</TranslatedText>
          </h1>
          <button
            onClick={() => setShowWithdrawalForm(true)}
            disabled={earningsData.availableBalance <= 0}
            className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <TranslatedText>Demander un retrait</TranslatedText>
          </button>
        </div>
      </div>

      <EarningsOverview earnings={earningsData} />
      
      <WithdrawalHistory 
        history={earningsData.withdrawalHistory}
        onRefresh={fetchEarningsData}
      />

      {showWithdrawalForm && (
        <WithdrawalForm
          availableBalance={earningsData.availableBalance}
          onClose={() => setShowWithdrawalForm(false)}
          onSuccess={handleWithdrawalSuccess}
        />
      )}
    </>
  );
};

export default InstructorWithdrawalsMain;