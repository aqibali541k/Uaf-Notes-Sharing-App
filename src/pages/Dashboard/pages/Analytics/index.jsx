import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuthContext } from "../../../../context/AuthContext";

const Analytics = () => {
  const { token } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  const COLORS = ["#2563eb", "#22c55e", "#facc15", "#ef4444"];
  // blue=Created, green=Shared, yellow=Private, red=Public

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/notes/analytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const {
          totalCreated,
          sharedNotes,
          privateNotes,
          publicNotes,
          monthlyData,
        } = res.data;

        // Pie chart data
        setPieData([
          { name: "Created", value: totalCreated },
          { name: "Shared", value: sharedNotes },
          { name: "Private", value: privateNotes },
          { name: "Public", value: publicNotes },
        ]);

        // Bar chart data
        setBarData(
          monthlyData.map((item) => ({
            name: item.month,
            Created: item.created,
            Shared: item.shared,
            Private: item.private,
            Public: item.public,
          })),
        );
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        📊 Notes Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Notes Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Monthly Notes Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Created" fill="#2563eb" />
              <Bar dataKey="Shared" fill="#22c55e" />
              <Bar dataKey="Private" fill="#facc15" />
              <Bar dataKey="Public" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
