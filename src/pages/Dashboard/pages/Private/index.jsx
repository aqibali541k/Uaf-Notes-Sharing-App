import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  message,
  Upload,
  Row,
  Col,
  Typography,
  Modal,
  Checkbox,
  Spin,
  Input,
  Avatar,
} from "antd";
import {
  UploadOutlined,
  FilePdfOutlined,
  EyeOutlined,
  DownloadOutlined,
  EditOutlined,
  ShareAltOutlined,
  SearchOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Private = () => {
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  // ---------------- FETCH NOTES ----------------
  const fetchNotes = async () => {
    try {
      setFetching(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/notes/read`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotes(Array.isArray(res.data.notes) ? res.data.notes : []);
    } catch (err) {
      message.error("Failed to load notes");
    } finally {
      setFetching(false);
    }
  };

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      message.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchUsers();
  }, []);

  // ---------------- UPLOAD PDF ONLY ----------------
  const uploadProps = {
    name: "pdf",
    accept: "application/pdf",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      if (file.type !== "application/pdf") {
        message.error("Only PDF files are allowed!");
        return;
      }

      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("title", file.name);

      try {
        setLoading(true);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/notes/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        message.success("PDF uploaded successfully!");
        fetchNotes();
        onSuccess();
      } catch (err) {
        message.error(err.response?.data?.message || "Upload failed!");
        onError();
      } finally {
        setLoading(false);
      }
    },
  };

  // ---------------- OPEN EDIT PAGE ----------------
  const handleEdit = (note) => {
    navigate("/dashboard/new-notes", { state: { noteToEdit: note } });
  };

  // ---------------- TOGGLE PRIVACY ----------------
  const handleTogglePrivacy = async (note) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/notes/privacy/${note._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      message.success(`Note is now ${note.isPrivate ? "Public" : "Private"}`);
      fetchNotes();
    } catch (err) {
      message.error("Failed to update privacy");
    }
  };

  // ---------------- OPEN SHARE MODAL ----------------
  const handleShare = (note) => {
    setCurrentNote(note);
    setSelectedUsers(note.sharedWith?.map((u) => u._id) || []);
    setShareModalVisible(true);
  };
  const handleDelete = async (note) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notes/delete/${note._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      message.success("Note deleted successfully");
      fetchNotes();
    } catch (err) {
      message.error("Failed to delete note");
    }
  };

  // ---------------- SHARE NOTE ----------------
  const handleShareSubmit = async () => {
    if (!currentNote) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/notes/share/${currentNote._id}`,
        { sharedWith: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      message.success("Note shared successfully");
      setShareModalVisible(false);
      fetchNotes();
    } catch (err) {
      message.error("Failed to share note");
    }
  };
  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );
  const handleDownload = async (note) => {
    try {
      setDownloadingId(note._id);

      const response = await axios.get(note.pdfUrl, {
        responseType: "blob", // ⭐ MOST IMPORTANT
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${note.title || "note"}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      message.error("PDF download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div style={{ padding: "30px", minHeight: "100vh", background: "#f4f7ff" }}>
      <Title level={2} style={{ color: "#1e3a8a", marginBottom: 30 }}>
        📚 My Notes
      </Title>

      {/* ---------------- UPLOAD ---------------- */}
      <Card
        style={{
          marginBottom: 30,
          background: "linear-gradient(135deg,#667eea,#764ba2)",
          borderRadius: 16,
          padding: "20px",
          textAlign: "center",
        }}
      >
        {/* <Upload {...uploadProps}> */}
        <Button
          onClick={() => navigate("/dashboard/new-notes")}
          size="large"
          icon={<UploadOutlined />}
          loading={loading}
          style={{
            background: "#fff",
            color: "#4f46e5",
            fontWeight: "600",
          }}
        >
          Upload PDF
        </Button>
        {/* </Upload> */}
        <Text style={{ display: "block", marginTop: 10, color: "#fff" }}>
          ⚠ Only PDF files are allowed. Videos or other file types are not
          supported.
        </Text>
      </Card>

      {/* ---------------- NOTES LIST ---------------- */}
      {fetching ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" tip="Loading notes..." />
        </div>
      ) : notes.length === 0 ? (
        <Text type="secondary">No notes found.</Text>
      ) : (
        <Row gutter={[24, 24]}>
          {(notes || []).map((note) => (
            <Col xs={24} sm={12} md={8} lg={6} key={note._id}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
                cover={
                  <div
                    style={{
                      height: 140,
                      background: "linear-gradient(135deg,#60a5fa,#6366f1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  >
                    <FilePdfOutlined style={{ fontSize: 50, color: "#fff" }} />
                  </div>
                }
              >
                <Title level={5} ellipsis>
                  {note.title || "PDF Note"}
                </Title>

                <div
                  style={{
                    display: "flex",
                    // justifyContent: "space-between",
                    marginTop: 15,
                    flexWrap: "wrap",
                    gap: "5px",
                  }}
                >
                  {/* DOWNLOAD */}
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    loading={downloadingId === note._id}
                    onClick={() => handleDownload(note)}
                    className="bg-blue-600! text-white!"
                  >
                    {downloadingId === note._id
                      ? "Downloading..."
                      : "Download PDF"}
                  </Button>

                  {/* EDIT */}
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(note)}
                    className="bg-blue-600! text-white!"
                  >
                    Edit
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(note)}
                    className="bg-red-600! text-white!"
                  ></Button>

                  {/* PUBLIC/PRIVATE */}
                  <Button
                    onClick={() => handleTogglePrivacy(note)}
                    className="text-yellow-400! bg-black!"
                  >
                    {note.isPrivate ? <LockOutlined /> : <UnlockOutlined />}
                  </Button>

                  {/* SHARE */}
                  <Button
                    icon={<ShareAltOutlined />}
                    onClick={() => handleShare(note)}
                    className="bg-blue-600! text-white!"
                  >
                    Share
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ---------------- SHARE MODAL ---------------- */}
      <Modal
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        onOk={handleShareSubmit}
        okText="Share"
        title="Share Note"
        width={420}
        style={{ padding: "16px" }}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <Avatar>{u.firstName?.[0]}</Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {u.firstName} {u.lastName}
                  </p>
                  {u.section === "A" ? (
                    <p className="text-xs text-green-600">
                      Section: {u.section}
                    </p>
                  ) : (
                    <p className="text-xs text-cyan-600">
                      Section: {u.section}
                    </p>
                  )}
                  {/* {u.role === "student" ? (
                    <p className="text-xs text-blue-600">Student</p>
                  ) : (
                    <p className="text-xs text-red-600">Admin</p>
                  )} */}
                  {u.role == "admin" ? (
                    <p className="text-xs text-red-600">{"Admin"}</p>
                  ) : (
                    <p className="text-xs text-blue-600">{"Student"}</p>
                  )}
                </div>
              </div>

              <Checkbox
                checked={selectedUsers.includes(u._id)}
                onChange={(e) =>
                  setSelectedUsers((prev) =>
                    e.target.checked
                      ? [...prev, u._id]
                      : prev.filter((id) => id !== u._id),
                  )
                }
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Private;
