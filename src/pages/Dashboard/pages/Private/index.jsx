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
  Space,
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
  PlusOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../constants";

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
        `${API_URL}/notes/read`,
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
      const response = await axios.get(note.fileUrl, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: note.fileType || response.data.type,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${note.title || "note"}.${note.fileExt || note.fileUrl.split(".").pop()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      message.error("Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header & Upload CTA */}
      <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden mb-12 bg-indigo-600">
        <div className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <UnlockOutlined className="text-[160px] text-white" />
          </div>

          <div className="relative z-10 text-center md:text-left">
            <Title level={1} className="m-0! text-white font-black! tracking-tight">My Personal Vault</Title>
            <Text className="text-indigo-100 mt-2 block text-lg opacity-90">Manage, share, and protect your digital academic assets.</Text>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/dashboard/new-notes")}
            className="h-16 px-10 rounded-2xl bg-white text-indigo-600 font-black! uppercase tracking-widest text-sm shadow-2xl hover:scale-105 hover:bg-indigo-50 transition-all border-none"
          >
            Upload New Note
          </Button>
        </div>
      </Card>

      {/* ---------------- NOTES LIST ---------------- */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
          <LockOutlined className="text-6xl text-gray-200 mb-4" />
          <p className="text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            Your vault is empty
          </p>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {notes.map((note) => (
            <Col key={note._id} xs={24} sm={12} lg={8}>
              <NoteCard
                note={note}
                onDownload={handleDownload}
                downloadingId={downloadingId}
                extraActions={
                  <div className="flex w-full gap-2 mt-2">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(note)}
                      className="rounded-xl flex-1 font-bold text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      icon={note.isPrivate ? <UnlockOutlined /> : <LockOutlined />}
                      onClick={() => handleTogglePrivacy(note)}
                      className="rounded-xl"
                      title={note.isPrivate ? "Make Public" : "Make Private"}
                    />
                    <Button
                      icon={<ShareAltOutlined />}
                      onClick={() => handleShare(note)}
                      className="rounded-xl"
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(note)}
                      className="rounded-xl"
                    />
                  </div>
                }
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Share Modal */}
      <Modal
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        onOk={handleShareSubmit}
        okText="Confirm Sharing"
        title={<Title level={4} className="m-0! font-black! uppercase tracking-tight">Share Resource</Title>}
        centered
        width={480}
        className="rounded-3xl overflow-hidden"
        okButtonProps={{ className: "h-12 rounded-xl bg-indigo-600 font-bold" }}
        cancelButtonProps={{ className: "h-12 rounded-xl" }}
      >
        <div className="py-6">
          <Input
            prefix={<SearchOutlined className="text-gray-300" />}
            placeholder="Search for students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-6 h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
          />

          <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Select Recipients</Text>
          <div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() =>
                  setSelectedUsers((prev) =>
                    selectedUsers.includes(u._id)
                      ? prev.filter((id) => id !== u._id)
                      : [...prev, u._id],
                  )
                }
                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 border ${selectedUsers.includes(u._id)
                  ? "bg-indigo-50 border-indigo-200 shadow-sm"
                  : "bg-white border-gray-50 hover:bg-gray-50 hover:border-gray-100"
                  }`}
              >
                <Avatar size="large" src={u.image} className="bg-indigo-100 text-indigo-600 font-black">
                  {u.firstName[0]}
                </Avatar>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-gray-800 text-sm">
                    {u.firstName} {u.lastName}
                  </span>
                  <Space split={<span className="text-gray-300">•</span>}>
                    <span className="text-[10px] text-indigo-500 font-black uppercase tracking-tighter">AG-{u.agNo?.split('-AG-')[1] || "0000"}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Sec {u.section || "N/A"}</span>
                  </Space>
                </div>
                <Checkbox checked={selectedUsers.includes(u._id)} className="custom-checkbox" />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Private;
