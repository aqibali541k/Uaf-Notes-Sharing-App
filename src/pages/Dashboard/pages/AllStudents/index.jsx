import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  Popconfirm,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  StopOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { API_URL } from "../../../../constants";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const StatusTag = ({ blocked }) => (
  <Tag
    color={blocked ? "red" : "green"}
    className="m-0 rounded-full border-none px-2.5 text-[11px] font-medium"
  >
    {blocked ? "Blocked" : "Active"}
  </Tag>
);

const Chip = ({ children }) => (
  <span className="rounded border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
    {children}
  </span>
);

const AllStudents = () => {
  const { token, user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isAdmin = user?.role === "admin";

  // ================= ADMIN VALIDATION =================
  useEffect(() => {
    if (!isAdmin) {
      message.error("Access denied. Admin only page.");
    }
  }, [isAdmin]);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    if (!isAdmin) return;

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

  const agNumber = (agNo) => agNo?.split("-AG-")[1] || agNo;

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
            className="bg-slate-100 text-slate-500"
          />
          <div className="flex flex-col">
            <Text className="text-sm font-medium text-slate-800">
              {r.firstName} {r.lastName}
            </Text>
            <Text className="text-xs text-slate-400">{r.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Academic",
      key: "academic",
      render: (_, r) => (
        <div className="flex flex-col gap-1.5">
          <Text className="text-sm text-slate-700">{r.degree}</Text>
          <div className="flex gap-2">
            <Chip>Sem {r.semester}</Chip>
            <Chip>Sec {r.section}</Chip>
          </div>
        </div>
      ),
    },
    {
      title: "AG Number",
      dataIndex: "agNo",
      render: (ag) => (
        <Tag className="m-0 rounded-md border-brand-100 bg-brand-50 font-medium text-brand-700">
          AG-{agNumber(ag)}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => <StatusTag blocked={r.isBlocked} />,
    },
    {
      title: "",
      key: "actions",
      render: (_, r) => (
        <div className="flex justify-end gap-2">
          <Button
            size="small"
            className="rounded-lg"
            icon={r.isBlocked ? <CheckOutlined /> : <StopOutlined />}
            onClick={() => toggleBlock(r._id, r.isBlocked)}
          >
            {r.isBlocked ? "Restore" : "Restrict"}
          </Button>
          <Popconfirm
            title="Delete this student?"
            description="This action cannot be undone."
            onConfirm={() => deleteUser(r._id)}
            okButtonProps={{ danger: true }}
            centered
          >
            <Button size="small" danger icon={<DeleteOutlined />} aria-label="Delete student" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // ================= MOBILE CARD =================
  const StudentCard = ({ s }) => (
    <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <Avatar
          size={48}
          src={s.image}
          icon={<UserOutlined />}
          className="shrink-0 bg-slate-100 text-slate-500"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {s.firstName} {s.lastName}
              </h3>
              <p className="truncate text-xs text-slate-400">{s.email}</p>
            </div>
            <StatusTag blocked={s.isBlocked} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip>{s.degree}</Chip>
            <Chip>Sem {s.semester}</Chip>
            <Chip>Sec {s.section}</Chip>
            <span className="rounded border border-brand-100 bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              AG-{agNumber(s.agNo)}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              block
              className="rounded-lg"
              icon={s.isBlocked ? <CheckOutlined /> : <StopOutlined />}
              onClick={() => toggleBlock(s._id, s.isBlocked)}
            >
              {s.isBlocked ? "Restore" : "Restrict"}
            </Button>

            <Popconfirm
              title="Delete this student?"
              onConfirm={() => deleteUser(s._id)}
              okButtonProps={{ danger: true }}
              centered
            >
              <Button danger icon={<DeleteOutlined />} aria-label="Delete student" />
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500"
            aria-hidden="true"
          >
            <StopOutlined className="text-lg" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">
            Admin access only
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This page is only available to administrators.
          </p>
          <Button
            type="primary"
            onClick={() => window.history.back()}
            className="mt-6 h-9 rounded-lg"
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Students</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage student accounts and access
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <TeamOutlined className="text-brand-600" aria-hidden="true" />
          <span className="font-semibold text-slate-900">{users.length}</span>
          <span className="text-slate-500">students</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center rounded-xl bg-white/60">
            <Spin size="large" />
          </div>
        )}

        {isMobile ? (
          <div>
            {users.length ? (
              users.map((s) => <StudentCard key={s._id} s={s} />)
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
                <p className="text-sm text-slate-400">No students found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Table
              columns={columns}
              dataSource={users}
              rowKey="_id"
              pagination={{ pageSize: 8 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllStudents;
