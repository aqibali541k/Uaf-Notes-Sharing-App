import React, { useEffect, useState } from "react";
import { Table, Avatar, Button, message, Popconfirm, Spin } from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";

const AllStudents = () => {
  const { token, user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
      // Filter only students
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

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      render: (img) => <Avatar src={img} icon={<UserOutlined />} />,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      responsive: ["sm"],
    },
    { title: "Email", dataIndex: "email", key: "email", responsive: ["md"] },
    { title: "Degree", dataIndex: "degree", key: "degree", responsive: ["lg"] },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      responsive: ["lg"],
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
      responsive: ["lg"],
    },
    { title: "AG No", dataIndex: "agNo", key: "agNo", responsive: ["md"] },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <span className={record.isBlocked ? "text-red-500" : "text-green-600"}>
          {record.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
      responsive: ["sm"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={record.isBlocked ? <CheckOutlined /> : <StopOutlined />}
            onClick={() => toggleBlock(record._id, record.isBlocked)}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => deleteUser(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        Access Denied. Admin only.
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-100 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <Spin size="large" />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">All Students</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default AllStudents;
