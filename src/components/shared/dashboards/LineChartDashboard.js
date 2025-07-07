"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineChartDashboard = ({ data, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const ctx = chartRef.current?.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: "line",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: title }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });

      return () => chart.destroy();
    }
  }, [data, title]);

  return (
    <div className="bg-white dark:bg-transparent p-4 rounded-lg shadow">
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChartDashboard;