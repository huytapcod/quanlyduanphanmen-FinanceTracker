import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell, // 👈 thêm dòng này
} from "recharts";

export default function StatsPage() {
  const [stats, setStats] = useState({ totals: [], byCategory: [], series: [] });

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/transactions/stats", {
        params: { groupBy: "month" },
      });
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalIncome = stats.totals.find((t) => t._id === "income")?.total || 0;
  const totalExpense = stats.totals.find((t) => t._id === "expense")?.total || 0;

  // Gộp lại theo category + type
  const groupedByCategory = (stats.byCategory || []).reduce((acc, c) => {
    const key = `${c._id.category || "Other"} (${c._id.type})`;
    if (!acc[key]) {
      acc[key] = { name: key, total: 0 };
    }
    acc[key].total += c.total;
    return acc;
  }, {});
  const categoryData = Object.values(groupedByCategory);

  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Statistics</h1>

      {/* Biểu đồ so sánh tổng Thu nhập vs Chi tiêu */}
      <div className="h-72 rounded-lg shadow p-4 bg-white dark:bg-gray-800">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { name: "Thu nhập", value: totalIncome },
              { name: "Chi tiêu", value: totalExpense },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="name" stroke="#1e293b" className="dark:!stroke-white" tick={{ fill: '#1e293b', className: 'dark:!fill-white' }} />
            <YAxis stroke="#1e293b" className="dark:!stroke-white" tick={{ fill: '#1e293b', className: 'dark:!fill-white' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
              wrapperClassName="dark:!bg-gray-900 dark:!text-white"
              labelClassName="dark:!text-white"
              itemStyle={{ color: '#000' }}
              cursor={{ fill: '#e5e7eb', fillOpacity: 0.2 }}
            />
            <Legend wrapperStyle={{ color: "#000" }} className="dark:!text-white" />
            <Bar dataKey="value" barSize={80} label={{ position: "top", fill: '#1e293b', className: 'dark:!fill-white' }}>
              <Cell fill="#4ade80" /> {/* Thu nhập: xanh */}
              <Cell fill="#f87171" /> {/* Chi tiêu: đỏ */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ theo category */}
      <div className="h-72 rounded-lg shadow p-4 bg-white dark:bg-gray-800">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis dataKey="name" stroke="#1e293b" className="dark:!stroke-white" tick={{ fill: '#1e293b', className: 'dark:!fill-white' }} />
            <YAxis stroke="#1e293b" className="dark:!stroke-white" tick={{ fill: '#1e293b', className: 'dark:!fill-white' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
              wrapperClassName="dark:!bg-gray-900 dark:!text-white"
              labelClassName="dark:!text-white"
              itemStyle={{ color: '#000' }}
              cursor={{ fill: '#e5e7eb', fillOpacity: 0.2 }}
            />
            <Legend wrapperStyle={{ color: "#000" }} className="dark:!text-white" />
            <Bar dataKey="total" fill="#3b82f6" className="dark:fill-blue-400" label={{ position: "top", fill: '#1e293b', className: 'dark:!fill-white' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
