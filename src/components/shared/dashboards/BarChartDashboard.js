"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarChartDashboard = ({ data, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const ctx = chartRef.current?.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: title }
          },
          scales: {
            y: { 
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
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

export default BarChartDashboard;