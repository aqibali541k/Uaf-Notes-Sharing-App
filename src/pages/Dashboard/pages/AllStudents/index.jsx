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
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";

const { useBreakpoint } = Grid;

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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/all`, {
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
        `${import.meta.env.VITE_API_URL}/users/block/${userId}`,
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/delete/${id}`, {
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
      title: "Avatar",
      dataIndex: "image",
      render: (img) => <Avatar src={img} icon={<UserOutlined />} />,
      width: 80,
    },
    { title: "Name", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Degree", dataIndex: "degree" },
    { title: "Semester", dataIndex: "semester" },
    { title: "Section", dataIndex: "section" },
    { title: "AG No", dataIndex: "agNo" },
    {
      title: "Status",
      render: (_, r) => (
        <Tag color={r.isBlocked ? "red" : "green"}>
          {r.isBlocked ? "Blocked" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, r) => (
        <div className="flex gap-2">
          <Button
            icon={r.isBlocked ? <CheckOutlined /> : <StopOutlined />}
            onClick={() => toggleBlock(r._id, r.isBlocked)}
          />
          <Popconfirm
            title="Delete this student?"
            onConfirm={() => deleteUser(r._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // ================= MOBILE CARD =================
  const StudentCard = ({ s }) => (
    <Card className="mb-3 rounded-xl shadow-sm" style={{ maxWidth: "250px" }}>
      <div className="flex gap-3">
        <Avatar size={50} src={s.image} icon={<UserOutlined />} />

        <div className="flex-1">
          <h3 className="font-semibold">{s.fullName}</h3>
          <p className="text-xs text-gray-500">{s.email}</p>

          <div className="flex flex-wrap gap-1 mt-2">
            <Tag>{s.degree}</Tag>
            <Tag>Sem {s.semester}</Tag>
            <Tag>Sec {s.section}</Tag>
            <Tag>AG {s.agNo}</Tag>
          </div>

          <Tag className="mt-2" color={s.isBlocked ? "red" : "green"}>
            {s.isBlocked ? "Blocked" : "Active"}
          </Tag>

          <div className="flex gap-2 mt-3">
            <Button
              size="small"
              icon={s.isBlocked ? <CheckOutlined /> : <StopOutlined />}
              onClick={() => toggleBlock(s._id, s.isBlocked)}
            >
              {s.isBlocked ? "Unblock" : "Block"}
            </Button>

            <Popconfirm
              title="Delete this student?"
              onConfirm={() => deleteUser(s._id)}
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </Card>
  );

  // ================= ACCESS DENIED =================
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        Access Denied. Admin only.
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="p-4 min-h-screen bg-gray-100 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <Spin size="large" />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">All Students</h2>

      {isMobile ? (
        users.length ? (
          users.map((s) => <StudentCard key={s._id} s={s} />)
        ) : (
          <p className="text-center text-gray-500">No students found</p>
        )
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          bordered
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AllStudents;
