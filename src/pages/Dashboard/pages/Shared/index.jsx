import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Modal, Avatar, Button, Spin, Row, Col, Typography } from "antd";
import { ShareAltOutlined, DeleteFilled } from "@ant-design/icons";
import SearchBar from "../SearchBar";
import { useAuthContext } from "../../../../context/AuthContext";
import NoteCard from "../../../../components/common/NoteCard";
import { API_URL } from "../../../../constants";

const { Text } = Typography;

const Shared = () => {
  const { token, user } = useAuthContext();

  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${API_URL}/notes/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.notes || []);
      } catch {
        message.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users.filter((u) => u._id !== user._id));
      } catch {
        message.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [token, user._id]);

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/sharedD/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
      message.success("Removed from shared list");
    } catch {
      message.error("Failed to remove note");
    }
  };

  const shareNote = async () => {
    if (!selectedUsers.length) {
      message.warning("Select at least one student");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/notes/share/${activeNote._id}`,
        { sharedWith: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotes((prev) => prev.map((n) => (n._id === activeNote._id ? res.data.note : n)));
      message.success("Note shared");
      setSelectedUsers([]);
      setIsShareOpen(false);
    } catch {
      message.info("You are not allowed to share this note");
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

  const filteredNotes = notes.filter((n) =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spin size="large" />
        <Text className="text-sm text-gray-400">Loading shared resources…</Text>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Shared Notes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Collaborative resources shared within the university network</p>
        </div>
        {notes.length > 0 && (
          <div className="w-full sm:w-64">
            <SearchBar onSearch={(v) => setSearchTerm(String(v))} />
          </div>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <ShareAltOutlined className="text-4xl text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">No shared notes found</p>
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {filteredNotes.map((note) => (
            <Col key={note._id} xs={24} sm={12} lg={8}>
              <NoteCard
                note={note}
                onDownload={handleDownload}
                downloadingId={downloadingId}
                extraActions={
                  <>
                    <Button
                      icon={<ShareAltOutlined />}
                      onClick={() => {
                        setActiveNote(note);
                        setSelectedUsers(note.sharedWith?.map((u) => u._id) || []);
                        setIsShareOpen(true);
                      }}
                      className="rounded-lg flex-1 text-xs h-8"
                      size="small"
                    >
                      Share
                    </Button>
                    <Button
                      danger
                      icon={<DeleteFilled />}
                      onClick={() => deleteNote(note._id)}
                      className="rounded-lg h-8"
                      size="small"
                    />
                  </>
                }
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Share Modal */}
      <Modal
        open={isShareOpen}
        onCancel={() => setIsShareOpen(false)}
        footer={null}
        title={<span className="text-sm font-semibold text-gray-800">Share Resource</span>}
        centered
      >
        <div className="py-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Select recipients</p>
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() =>
                  setSelectedUsers((prev) =>
                    prev.includes(u._id)
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
                <Avatar size="small" src={u.image} className="bg-indigo-100 text-indigo-600 shrink-0">
                  {u.firstName[0]}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-gray-400">AG-{u.agNo?.split("-AG-")[1] || "0000"}</p>
                </div>
                {selectedUsers.includes(u._id) && (
                  <span className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs shrink-0">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button
          type="primary"
          onClick={shareNote}
          block
          className="h-9 rounded-lg font-medium"
          style={{ backgroundColor: "#4f46e5" }}
        >
          Share with {selectedUsers.length} student{selectedUsers.length !== 1 ? "s" : ""}
        </Button>
      </Modal>
    </div>
  );
};

export default Shared;
