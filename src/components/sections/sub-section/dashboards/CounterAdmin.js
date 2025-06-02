"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import counter1 from "@/assets/images/counter/counter__1.png";
import counter2 from "@/assets/images/counter/counter__2.png";
import counter3 from "@/assets/images/counter/counter__3.png";
import counter4 from "@/assets/images/counter/counter__4.png";
import CounterDashboard from "@/components/shared/dashboards/CounterDashboard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

const CounterAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format money display
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const counts = stats ? [
    {
      name: stats.stats[0].title, // "Total Courses"
      image: counter4,
      data: stats.stats[0].value, // stats.totalCourses
      symbol: "+",
    },
    {
      name: stats.stats[1].title, // "Active Courses"
      image: counter2,
      data: stats.stats[1].value, // stats.activeCourses
      symbol: stats.stats[1].value > 0 ? "+" : "",
    },
    {
      name: stats.stats[2].title, // "Pending Courses"
      image: counter3,
      data: stats.stats[2].value, // stats.pendingCourses
      symbol: "",
    },
    {
      name: stats.stats[3].title, // "Total Students"
      image: counter3,
      data: stats.stats[3].value, // stats.totalStudents
      symbol: stats.stats[3].value > 0 ? "+" : "",
    },
    {
      name: stats.stats[4].title, // "Total Instructors"
      image: counter1,
      data: stats.stats[4].value, // stats.totalInstructors
      symbol: stats.stats[4].value > 0 ? "+" : "",
    },
    {
      name: stats.stats[6].title, // "Platform Revenue"
      image: counter4,
      data: formatMoney(stats.stats[6].value), // stats.totalRevenue
      symbol: "",
      isMoney: true
    },
    {
      name: stats.stats[5].title, // "Total Purchases"
      image: counter1,
      data: stats.stats[5].value, // stats.totalPurchases
      symbol: stats.stats[5].value > 0 ? "+" : "",
    }
  ] : [];

  if (loading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <HeadingDashboard>Dashboard</HeadingDashboard>
        <div className="flex justify-center items-center h-40">
          <p className="text-contentColor dark:text-contentColor-dark">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <CounterDashboard counts={counts}>
      <HeadingDashboard>Dashboard</HeadingDashboard>
    </CounterDashboard>
  );
};

export default CounterAdmin;