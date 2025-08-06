"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChartDashboard = ({ data, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const ctx = chartRef.current?.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: "doughnut",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right' },
            title: { display: true, text: title }
          },
          cutout: '70%'
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

export default PieChartDashboard;