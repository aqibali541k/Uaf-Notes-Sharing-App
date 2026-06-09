import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Button,
  message,
  Popconfirm,
  Spin,
  Card,
  Tag,
  Grid,
  Typography,
  Space,
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckOutlined,
  RobotOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { API_URL, COLORS } from "../../../../constants";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const AllStudents = () => {
  const { token, user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // ================= ADMIN VALIDATION =================
  useEffect(() => {
    if (!user || user.role !== "admin") {
      message.error("Access denied. Admin only page.");
    }
  }, [user]);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    if (!user || user.role !== "admin") return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users.filter((u) => u.role === "student"));
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  // ================= BLOCK / UNBLOCK =================
  const toggleBlock = async (userId, isBlocked) => {
    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/users/block/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      message.success(`User has been ${isBlocked ? "unblocked" : "blocked"}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= TABLE COLUMNS (DESKTOP) =================
  const columns = [
    {
      title: "Student",
      key: "student",
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <Avatar 
            src={r.image} 
            icon={<UserOutlined />} 
            className="bg-indigo-100 text-indigo-600 font-bold border-2 border-white shadow-sm"
          />
          <div className="flex flex-col">
            <Text className="font-bold text-gray-800">{r.firstName} {r.lastName}</Text>
            <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{r.email}</Text>
          </div>
        </div>
      ),
    },
    { 
      title: "Academic Info", 
      key: "academic",
      render: (_, r) => (
        <div className="flex flex-col gap-1">
          <Text className="text-xs font-bold text-gray-600">{r.degree}</Text>
          <div className="flex gap-2">
             <Tag className="m-0! rounded-full text-[9px] font-black uppercase tracking-tighter bg-gray-50 border-gray-100">Sem {r.semester}</Tag>
             <Tag className="m-0! rounded-full text-[9px] font-black uppercase tracking-tighter bg-gray-50 border-gray-100">Sec {r.section}</Tag>
          </div>
        </div>
      )
    },
    { 
      title: "AG Number", 
      dataIndex: "agNo",
      render: (ag) => (
        <Tag className="rounded-lg font-black bg-indigo-50 border-indigo-100 text-indigo-600">
          {ag?.split('-AG-')[1] || ag}
        </Tag>
      )
    },
    {
      title: "Account Status",
      key: "status",
      render: (_, r) => (
        <Tag color={r.isBlocked ? "volcano" : "emerald"} className="rounded-full px-3 py-0.5 border-none font-bold text-[10px] uppercase tracking-widest">
          {r.isBlocked ? "Blocked" : "Healthy"}
        </Tag>
      ),
    },
    {
      title: "Management",
      key: "actions",
      render: (_, r) => (
        <div className="flex gap-2">
          <Button
            size="small"
            className={`rounded-lg font-bold border-none ${r.isBlocked ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}
            icon={r.isBlocked ? <CheckOutlined /> : <StopOutlined />}
            onClick={() => toggleBlock(r._id, r.isBlocked)}
          >
            {r.isBlocked ? "Restore" : "Restrict"}
          </Button>
          <Popconfirm
            title="Purge student record?"
            description="This action cannot be undone."
            onConfirm={() => deleteUser(r._id)}
            okButtonProps={{ danger: true, className: "rounded-lg" }}
            cancelButtonProps={{ className: "rounded-lg" }}
            centered
          >
            <Button size="small" danger className="rounded-lg border-none bg-red-50" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // ================= MOBILE CARD =================
  const StudentCard = ({ s }) => (
    <Card className="mb-4 rounded-3xl shadow-sm border-gray-100 overflow-hidden">
      <div className="flex items-start gap-4">
        <Avatar size={60} src={s.image} icon={<UserOutlined />} className="bg-indigo-100 text-indigo-600 font-bold border-4 border-white shadow-md shrink-0" />

        <div className="flex-1">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="font-black text-gray-800 text-base m-0 tracking-tight">{s.firstName} {s.lastName}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{s.email}</p>
             </div>
             <Tag color={s.isBlocked ? "red" : "green"} className="m-0! rounded-full text-[9px] font-black uppercase border-none">
                {s.isBlocked ? "Blocked" : "Active"}
             </Tag>
          </div>

          <Row gutter={[8, 8]} className="mb-4">
            <Col span={12}><Space className="text-[10px] font-bold text-gray-500 uppercase"><RobotOutlined className="text-indigo-500" /> {s.degree}</Space></Col>
            <Col span={12}><Space className="text-[10px] font-bold text-gray-500 uppercase"><TeamOutlined className="text-indigo-500" /> Sec {s.section}</Space></Col>
            <Col span={24}><Tag className="w-full text-center rounded-xl font-black bg-gray-50 border-gray-100">AG-{s.agNo?.split('-AG-')[1] || s.agNo}</Tag></Col>
          </Row>

          <div className="flex gap-2">
            <Button
              block
              className={`rounded-xl font-bold ${s.isBlocked ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"} border-none`}
              icon={s.isBlocked ? <CheckOutlined /> : <StopOutlined />}
              onClick={() => toggleBlock(s._id, s.isBlocked)}
            >
              {s.isBlocked ? "Restore" : "Restrict"}
            </Button>

            <Popconfirm
              title="Delete record?"
              onConfirm={() => deleteUser(s._id)}
              okButtonProps={{ danger: true, className: "rounded-xl" }}
              cancelButtonProps={{ className: "rounded-xl" }}
              centered
            >
              <Button danger className="rounded-xl border-none bg-red-50" icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        </div>
      </div>
    </Card>
  );

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="rounded-[3rem] shadow-2xl border-none p-12 text-center max-w-md">
           <StopOutlined className="text-7xl text-red-400 mb-6" />
           <Title level={2} className="m-0! font-black! tracking-tight text-gray-800">UNAUTHORIZED</Title>
           <Text className="text-gray-400 mt-4 block text-lg">This command center is reserved for high-level clearance only. Please return to your station.</Text>
           <Button type="primary" size="large" onClick={() => window.history.back()} className="mt-8 h-14 px-10 rounded-2xl bg-indigo-600 font-bold uppercase tracking-widest text-xs border-none">Initiate Return</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Header Section */}
      <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden mb-12 bg-indigo-600">
        <div className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <TeamOutlined className="text-[160px] text-white" />
          </div>
          
          <div className="relative z-10 text-center md:text-left">
            <Title level={1} className="m-0! text-white font-black! tracking-tight">Student Control Center</Title>
            <Text className="text-indigo-100 mt-2 block text-lg opacity-90">Manage student access, verify credentials, and maintain network integrity.</Text>
          </div>
          
          <Space className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
             <div className="text-center px-4">
                <div className="text-2xl font-black text-white">{users.length}</div>
                <div className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Active Students</div>
             </div>
          </Space>
        </div>
      </Card>

      {/* Main Content */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-50 rounded-4xl">
            <Spin size="large" />
          </div>
        )}

        {isMobile ? (
          <div className="pb-8">
            {users.length ? (
              users.map((s) => <StudentCard key={s._id} s={s} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No personnel records found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-4xl shadow-xl border border-gray-100 p-4">
            <Table
              columns={columns}
              dataSource={users}
              rowKey="_id"
              pagination={{ 
                pageSize: 8,
                className: "custom-pagination"
              }}
              className="custom-table"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllStudents;
