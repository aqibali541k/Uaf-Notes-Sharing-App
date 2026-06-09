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
import { Spin, Select, message, Card, Typography, Space, Row, Col } from "antd";
import { AreaChartOutlined, BarChartOutlined, PieChartOutlined } from "@ant-design/icons";
import { API_URL, COLORS } from "../../../../constants";

const { Option } = Select;
const { Title, Text } = Typography;

const Analytics = () => {
  const { token, user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger];

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/notes/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const {
        totalCreated = 0,
        sharedNotes = 0,
        privateNotes = 0,
        publicNotes = 0,
        monthlyData: rawMonthlyData = [],
      } = res.data || {};

      const monthlyData = Array.isArray(rawMonthlyData) ? rawMonthlyData : [];

      // Pie chart
      setPieData([
        { name: "My Notes", value: totalCreated },
        { name: "Shared", value: sharedNotes },
        { name: "Private", value: privateNotes },
        { name: "Public", value: publicNotes },
      ]);

      // Bar chart
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
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Spin size="large" />
        <Text className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Assembling your data engine...</Text>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden mb-12 bg-indigo-600">
        <div className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <AreaChartOutlined className="text-[160px] text-white" />
          </div>
          
          <div className="relative z-10 text-center md:text-left">
            <Title level={1} className="m-0! text-white font-black! tracking-tight text-4xl sm:text-5xl">Insight Center</Title>
            <Text className="text-indigo-100 mt-2 block text-lg opacity-90 font-medium">Visualize your academic momentum and note-taking patterns.</Text>
          </div>

          {user?.role === "admin" && (
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 min-w-[240px]">
              <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-3 block">View Scope</Text>
              <Select defaultValue="self" className="w-full h-11 custom-glass-select" placeholder="Select Scope">
                <Option value="self">Personal Analytics</Option>
                <Option value="all">Global (Network Wide)</Option>
              </Select>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        {/* Pie Chart Card */}
        <Card className="rounded-4xl shadow-xl border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
               <PieChartOutlined className="text-2xl text-indigo-600" />
            </div>
            <div>
              <Title level={4} className="m-0! font-black! tracking-tight">Distribution</Title>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Snapshot of your library</Text>
            </div>
          </div>

          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    percent > 0 ? `${name}` : ""
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar Chart Card */}
        <Card className="rounded-4xl shadow-xl border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
           <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
               <BarChartOutlined className="text-2xl text-emerald-600" />
            </div>
            <div>
              <Title level={4} className="m-0! font-black! tracking-tight">Activity Log</Title>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly contribution trends</Text>
            </div>
          </div>

          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontWeight: 'bold', fontSize: 10 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 12 }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="Created" fill={COLORS.primary} radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="Shared" fill={COLORS.secondary} radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="Private" fill={COLORS.accent} radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="Public" fill={COLORS.danger} radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
