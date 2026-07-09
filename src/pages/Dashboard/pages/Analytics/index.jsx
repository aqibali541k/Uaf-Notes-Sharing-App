import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useAuthContext } from "../../../../context/AuthContext";
import { Spin, Select, message, Typography } from "antd";
import { PieChartOutlined, BarChartOutlined } from "@ant-design/icons";
import { API_URL, COLORS } from "../../../../constants";

const { Option } = Select;
const { Text } = Typography;

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger];

const Analytics = () => {
  const { token, user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/notes/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const {
        totalCreated = 0,
        sharedNotes = 0,
        privateNotes = 0,
        publicNotes = 0,
        monthlyData: rawMonthlyData = [],
      } = res.data || {};

      const monthlyData = Array.isArray(rawMonthlyData) ? rawMonthlyData : [];

      setPieData([
        { name: "My Notes", value: totalCreated },
        { name: "Shared", value: sharedNotes },
        { name: "Private", value: privateNotes },
        { name: "Public", value: publicNotes },
      ]);

      setBarData(
        monthlyData.map((item) => ({
          name: item?.month || "Unknown",
          Created: item?.created || 0,
          Shared: item?.shared || 0,
          Private: item?.private || 0,
          Public: item?.public || 0,
        })),
      );
    } catch (error) {
      console.error("Error fetching analytics:", error);
      message.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spin size="large" />
        <Text className="text-sm text-gray-400">Loading analytics…</Text>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Your note-taking activity and library overview</p>
        </div>
        {user?.role === "admin" && (
          <Select defaultValue="self" className="w-48 h-9" placeholder="View scope">
            <Option value="self">Personal</Option>
            <Option value="all">Network-wide</Option>
          </Select>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChartOutlined className="text-indigo-600 text-base" />
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Library Distribution</h2>
              <p className="text-xs text-gray-400">Snapshot of your note categories</p>
            </div>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => percent > 0 ? name : ""}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07)" }}
                />
                <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ paddingTop: 16 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChartOutlined className="text-emerald-600 text-base" />
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Monthly Activity</h2>
              <p className="text-xs text-gray-400">Contribution trends over time</p>
            </div>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07)" }}
                />
                <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ paddingTop: 16 }} />
                <Bar dataKey="Created" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Shared" fill={COLORS.secondary} radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Private" fill={COLORS.accent} radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Public" fill={COLORS.danger} radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
