"use client";
import { useState, useEffect } from "react";
import WithdrawalStats from "@/components/sections/sub-section/dashboards/WithdrawalStats";
import WithdrawalRequestsList from "@/components/sections/sub-section/dashboards/WithdrawalRequestsList";
import WithdrawalDetailsModal from "@/components/sections/sub-section/dashboards/WithdrawalDetailsModal";
import TranslatedText from "@/components/shared/TranslatedText";

const AdminWithdrawalsMain = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchWithdrawalRequests = async (page = 1, filterParams = filters) => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filterParams).filter(([_, v]) => v && v !== 'all'))
      });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/admin/requests?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWithdrawalRequests(data.data.requests);
        setTotalPages(data.data.totalPages);
        setCurrentPage(data.data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching withdrawal stats:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchWithdrawalRequests(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchWithdrawalRequests(1, newFilters);
  };

  const handlePageChange = (page) => {
    fetchWithdrawalRequests(page);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = async (requestId, newStatus, updateData = {}) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/admin/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          ...updateData
        })
      });
      
      if (response.ok) {
        // Refresh data
        fetchWithdrawalRequests(currentPage);
        fetchStats();
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
    }
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
        <h1 className="text-2xl font-bold text-blackColor dark:text-white">
          <TranslatedText>Gestion des retraits</TranslatedText> 
        </h1>
        <p className="text-contentColor dark:text-contentColor-dark mt-2">
          <TranslatedText>Gérez les demandes de retrait et les paiements des instructeurs</TranslatedText>
        </p>
      </div>

      <WithdrawalStats stats={stats} />
      
      <WithdrawalRequestsList
        requests={withdrawalRequests}
        currentPage={currentPage}
        totalPages={totalPages}
        filters={filters}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
        onStatusUpdate={handleStatusUpdate}
      />

      {showDetailsModal && selectedRequest && (
        <WithdrawalDetailsModal
          request={selectedRequest}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

export default AdminWithdrawalsMain;