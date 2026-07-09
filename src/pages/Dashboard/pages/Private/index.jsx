import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button, message, Row, Col, Typography, Modal, Checkbox, Spin, Input, Avatar, Space,
} from "antd";
import {
  UploadOutlined, EditOutlined, ShareAltOutlined, SearchOutlined,
  DeleteOutlined, LockOutlined, UnlockOutlined, PlusOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../constants";
import NoteCard from "../../../../components/common/NoteCard";

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

  const fetchNotes = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`${API_URL}/notes/read`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(Array.isArray(res.data.notes) ? res.data.notes : []);
    } catch {
      message.error("Failed to load notes");
    } finally {
      setFetching(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch {
      message.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchUsers();
  }, []);

  const handleEdit = (note) => navigate("/dashboard/new-notes", { state: { noteToEdit: note } });

  const handleTogglePrivacy = async (note) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/notes/privacy/${note._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      message.success(`Note is now ${note.isPrivate ? "Public" : "Private"}`);
      fetchNotes();
    } catch {
      message.error("Failed to update privacy");
    }
  };

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
      message.success("Note deleted");
      fetchNotes();
    } catch {
      message.error("Failed to delete note");
    }
  };

  const handleShareSubmit = async () => {
    if (!currentNote) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/notes/share/${currentNote._id}`,
        { sharedWith: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      message.success("Note shared");
      setShareModalVisible(false);
      fetchNotes();
    } catch {
      message.error("Failed to share note");
    }
  };

  const handleDownload = async (note) => {
    try {
      setDownloadingId(note._id);
      const response = await axios.get(note.fileUrl, { responseType: "blob" });
      const blob = new Blob([response.data], { type: note.fileType || response.data.type });
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

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spin size="large" />
        <Text className="text-sm text-gray-400">Loading your notes…</Text>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Notes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage, edit, and share your uploaded resources</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/dashboard/new-notes")}
          className="h-9 rounded-lg text-sm font-medium border-none"
          style={{ backgroundColor: "#4f46e5" }}
        >
          Upload Note
        </Button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <LockOutlined className="text-4xl text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Your vault is empty — upload your first note above</p>
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {notes.map((note) => (
            <Col key={note._id} xs={24} sm={12} lg={8}>
              <NoteCard
                note={note}
                onDownload={handleDownload}
                downloadingId={downloadingId}
                extraActions={
                  <div className="flex w-full gap-1.5">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(note)}
                      className="rounded-lg flex-1 text-xs h-8"
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      icon={note.isPrivate ? <UnlockOutlined /> : <LockOutlined />}
                      onClick={() => handleTogglePrivacy(note)}
                      className="rounded-lg h-8"
                      size="small"
                      title={note.isPrivate ? "Make Public" : "Make Private"}
                    />
                    <Button
                      icon={<ShareAltOutlined />}
                      onClick={() => handleShare(note)}
                      className="rounded-lg h-8"
                      size="small"
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(note)}
                      className="rounded-lg h-8"
                      size="small"
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
        okText="Share"
        title={<span className="text-sm font-semibold text-gray-800">Share Resource</span>}
        centered
        width={460}
        okButtonProps={{ className: "h-9 rounded-lg", style: { backgroundColor: "#4f46e5" } }}
        cancelButtonProps={{ className: "h-9 rounded-lg" }}
      >
        <div className="py-4">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search students…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 h-9 rounded-lg border-gray-200"
          />
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Select recipients</p>
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
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
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                  selectedUsers.includes(u._id)
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white border-gray-100 hover:bg-gray-50"
                }`}
              >
                <Avatar size="small" src={u.image} className="bg-indigo-100 text-indigo-600 font-semibold shrink-0">
                  {u.firstName[0]}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-gray-400">Sec {u.section || "N/A"}</p>
                </div>
                <Checkbox checked={selectedUsers.includes(u._id)} className="pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Private;
