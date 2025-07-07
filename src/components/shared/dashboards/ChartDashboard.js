"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import LineChartDashboard from "./LineChartDashboard";
import PieChartDashboard from "./PieChartDashboard";
import BarChartDashboard from "./BarChartDashboard";

const ChartDashboard = () => {
  const [chartData, setChartData] = useState({
    enrollment: null,
    distribution: null,
    revenue: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const [enrollmentRes, distributionRes, revenueRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/charts/enrollment-trends`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/charts/course-distribution`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/charts/revenue-data`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setChartData({
          enrollment: enrollmentRes.data.data,
          distribution: distributionRes.data.data,
          revenue: revenueRes.data.data
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="py-10 px-5 mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="flex justify-center items-center h-64">
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-5 mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="flex flex-wrap gap-y-8">
        {/* Enrollment Trends - Line Chart */}
        <div className="w-full lg:w-2/3 pr-0 lg:pr-4">
          <LineChartDashboard 
            data={chartData.enrollment} 
            title="Monthly Enrollment Trends"
          />
        </div>
        
        {/* Course Distribution - Pie Chart */}
        <div className="w-full lg:w-1/3">
          <PieChartDashboard 
            data={chartData.distribution} 
            title="Course Categories Distribution"
          />
        </div>
        
        {/* Revenue Data - Bar Chart */}
        <div className="w-full">
          <BarChartDashboard 
            data={chartData.revenue} 
            title="Monthly Platform Revenue"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartDashboard;