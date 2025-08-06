"use client";
import { useState, useEffect } from "react";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import TranslatedText from "@/components/shared/TranslatedText";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "all",
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/instructor/order-history?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setOrders(result.data.orders || []);
        setSummary(result.data.summary || {});
        setPagination(result.data.pagination || {});
      } else {
        setError(result.message || "Failed to fetch order history");
      }
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError(err.message || "Failed to fetch order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 when changing filters
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get("search");
    handleFilterChange("search", search);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: "bg-greencolor2",
        text: "Success",
      },
      pending: {
        bg: "bg-yellow-500",
        text: "Processing",
      },
      failed: {
        bg: "bg-red-500",
        text: "Failed",
      },
      cancelled: {
        bg: "bg-gray-500",
        text: "Canceled",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`h-22px inline-block px-7px ${config.bg} leading-22px font-bold text-whiteColor rounded-md text-xs`}
      >
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <HeadingDashboard>
          <TranslatedText>Historique des commandes</TranslatedText>
        </HeadingDashboard>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor"></div>
          <span className="ml-3 text-contentColor dark:text-contentColor-dark">
            Loading <TranslatedText>Historique des commandes</TranslatedText>...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <HeadingDashboard>
          <TranslatedText>Historique des commandes</TranslatedText>
        </HeadingDashboard>
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">⚠️ Error Loading Data</div>
          <p className="text-contentColor dark:text-contentColor-dark mb-4">
            {error}
          </p>
          <button
            onClick={fetchOrderHistory}
            className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/80 transition-colors"
          >
            <TranslatedText>Réessayer</TranslatedText>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <HeadingDashboard>
        <TranslatedText>Historique des commandes</TranslatedText>
      </HeadingDashboard>

      {/* Summary Cards */}
      {summary && Object.keys(summary).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-lightGrey5 dark:bg-whiteColor-dark p-4 rounded-md">
            <div className="text-sm text-contentColor dark:text-contentColor-dark">
              {" "}
              <TranslatedText>Total des commandes</TranslatedText>
            </div>
            <div className="text-xl font-bold text-blackColor dark:text-blackColor-dark">
              {summary.totalOrders || 0}
            </div>
          </div>
          <div className="bg-lightGrey5 dark:bg-whiteColor-dark p-4 rounded-md">
            <div className="text-sm text-contentColor dark:text-contentColor-dark">
              Total Revenue
            </div>
            <div className="text-xl font-bold text-greencolor2">
              {formatCurrency(summary.totalRevenue || 0)}
            </div>
          </div>
          <div className="bg-lightGrey5 dark:bg-whiteColor-dark p-4 rounded-md">
            <div className="text-sm text-contentColor dark:text-contentColor-dark">
              <TranslatedText>Vos gains</TranslatedText>
            </div>
            <div className="text-xl font-bold text-primaryColor">
              {formatCurrency(summary.totalInstructorEarnings || 0)}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-lightGrey5 dark:bg-whiteColor-dark p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-blackColor dark:text-white"
            >
              <option value="all">
                <TranslatedText>Tous les statuts</TranslatedText>
              </option>
              <option value="completed">
                <TranslatedText>Terminé</TranslatedText>
              </option>
              <option value="pending">
                <TranslatedText>En attente</TranslatedText>
              </option>
              <option value="failed">
                <TranslatedText>Échoué</TranslatedText>
              </option>
              <option value="cancelled">
                <TranslatedText>Annulé</TranslatedText>
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-1">
              <TranslatedText>De la date</TranslatedText>
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-blackColor dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-1">
              <TranslatedText>À la date</TranslatedText>
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-blackColor dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-1">
              <TranslatedText>Éléments par page</TranslatedText>
            </label>
            <select
              value={filters.limit}
              onChange={(e) =>
                handleFilterChange("limit", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-blackColor dark:text-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Search by course name, student name, email, or order ID..."
            defaultValue={filters.search}
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-blackColor dark:text-white placeholder-gray-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/80 transition-colors"
          >
            <TranslatedText>Rechercher</TranslatedText>
          </button>
          {filters.search && (
            <button
              type="button"
              onClick={() => handleFilterChange("search", "")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <TranslatedText>Effacer</TranslatedText>
            </button>
          )}
        </form>
      </div>

      {/* Orders Table */}
      <div className="overflow-auto">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-2">
              <TranslatedText>Aucune commande trouvée</TranslatedText>
            </h3>
            <p className="text-contentColor dark:text-contentColor-dark">
              {filters.search ||
              filters.status !== "all" ||
              filters.dateFrom ||
              filters.dateTo ? (
                <TranslatedText>
                  Aucune commande ne correspond à vos filtres actuels. Essayez
                  d'ajuster vos critères de recherche.
                </TranslatedText>
              ) : (
                <TranslatedText>
                  Vous n'avez pas encore reçu de commandes. Continuez à
                  promouvoir vos cours !
                </TranslatedText>
              )}
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-sm md:text-base text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark leading-1.8 md:leading-1.8">
              <tr>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>ID de commande</TranslatedText>
                </th>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Cours</TranslatedText>
                </th>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Étudiant</TranslatedText>
                </th>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Date</TranslatedText>
                </th>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Montant</TranslatedText>
                </th>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Vos gains</TranslatedText>
                </th>
                <th className="px-5px py-10px md:px-5">
                  <TranslatedText>Statut</TranslatedText>
                </th>
              </tr>
            </thead>
            <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`leading-1.8 md:leading-1.8 ${
                    index % 2 === 1
                      ? "bg-lightGrey5 dark:bg-whiteColor-dark"
                      : ""
                  }`}
                >
                  <td className="px-5px py-10px md:px-5 font-normal">
                    <p className="text-blackColor dark:text-blackColor-dark font-medium">
                      #{order.reference || order._id.slice(-8)}
                    </p>
                    {order.transactionId && (
                      <p className="text-xs text-contentColor dark:text-contentColor-dark">
                        {order.transactionId}
                      </p>
                    )}
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <p className="font-medium text-blackColor dark:text-blackColor-dark">
                      {order.course?.title || "Deleted Course"}
                    </p>
                    {order.course?.originalPrice !== order.amount && (
                      <p className="text-xs text-green-600">
                        Discounted from{" "}
                        {formatCurrency(order.course?.originalPrice)}
                      </p>
                    )}
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <p className="font-medium text-blackColor dark:text-blackColor-dark">
                      {order.student?.firstName} {order.student?.lastName}
                    </p>
                    <p className="text-xs text-contentColor dark:text-contentColor-dark">
                      {order.student?.email}
                    </p>
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <p>{formatDate(order.createdAt)}</p>
                    {order.completedAt &&
                      order.paymentStatus === "completed" && (
                        <p className="text-xs text-contentColor dark:text-contentColor-dark">
                          Completed: {formatDate(order.completedAt)}
                        </p>
                      )}
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <p className="font-medium text-blackColor dark:text-blackColor-dark">
                      {formatCurrency(order.amount)}
                    </p>
                    <p className="text-xs text-contentColor dark:text-contentColor-dark">
                      {order.currency || "USD"}
                    </p>
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    <p className="font-medium text-primaryColor">
                      {formatCurrency(order.instructorEarnings || 0)}
                    </p>
                    <p className="text-xs text-contentColor dark:text-contentColor-dark">
                      {order.revenueSplit?.instructor || 90}% share
                    </p>
                  </td>
                  <td className="px-5px py-10px md:px-5">
                    {getStatusBadge(order.paymentStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm text-contentColor dark:text-contentColor-dark">
            <TranslatedText>
              Affichage de{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} à{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              sur {pagination.totalItems} résultats
            </TranslatedText>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                handleFilterChange("page", pagination.currentPage - 1)
              }
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <TranslatedText>Précédent</TranslatedText>
            </button>
            <span className="px-3 py-1 text-sm text-contentColor dark:text-contentColor-dark">
              <TranslatedText>Page</TranslatedText> {pagination.currentPage}{" "}
              <TranslatedText>sur</TranslatedText> {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                handleFilterChange("page", pagination.currentPage + 1)
              }
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <TranslatedText>Suivant</TranslatedText>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
