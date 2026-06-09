import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Modal, Avatar, Tooltip, Button, Spin, Row, Col, Typography } from "antd";
import {
  ShareAltOutlined,
  DeleteFilled,
  DownloadOutlined,
} from "@ant-design/icons";
import SearchBar from "../SearchBar";
import { useAuthContext } from "../../../../context/AuthContext";
import NoteCard from "../../../../components/common/NoteCard";
import { API_URL, COLORS } from "../../../../constants";

const { Text, Title } = Typography;

const Shared = () => {
  const { token, user } = useAuthContext();

  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Share modal
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Download loader
  const [downloadingId, setDownloadingId] = useState(null);

  // ================= FETCH SHARED NOTES =================
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/notes/shared`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setNotes(res.data.notes || []);
      } catch (err) {
        console.error(err);
        message.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [token]);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/users/all`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUsers(res.data.users.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error(err);
        message.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [token, user._id]);

  // ================= DELETE NOTE =================
  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/notes/sharedD/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotes((prev) => prev.filter((n) => n._id !== id));
      message.success("Note removed from your shared list");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete note");
    }
  };

  // ================= SHARE NOTE =================
  const shareNote = async () => {
    if (!selectedUsers.length) {
      message.warning("Select at least one user");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/notes/share/${activeNote._id}`,
        { sharedWith: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setNotes((prev) =>
        prev.map((n) => (n._id === activeNote._id ? res.data.note : n)),
      );
      message.success("Note shared successfully");
      setSelectedUsers([]);
      setIsShareOpen(false);
    } catch (err) {
      console.error(err);
      message.info("You are not allowed to share this note");
    }
  };

  // ================= DOWNLOAD NOTE =================
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
      link.download = `${note.title || "note"}.${
        note.fileExt || note.fileUrl.split(".").pop()
      }`;
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

  // ================= FILTER NOTES =================
  const filteredNotes = notes.filter((n) =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Spin size="large" />
        <Text className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading shared repository...</Text>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Title level={2} className="m-0! font-black! tracking-tight">Shared Notes</Title>
          <Text className="text-gray-400 mt-2 block">Collaborative resources shared within the university network</Text>
        </div>
        
        {notes.length > 0 && (
          <div className="w-full md:w-80">
            <SearchBar onSearch={(v) => setSearchTerm(String(v))} />
          </div>
        )}
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
           <ShareAltOutlined className="text-6xl text-gray-200 mb-4" />
           <p className="text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
             No shared resources found
           </p>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
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
                      className="rounded-xl flex-1 font-bold text-xs"
                    >
                      Share
                    </Button>
                    <Button 
                      danger 
                      icon={<DeleteFilled />} 
                      onClick={() => deleteNote(note._id)}
                      className="rounded-xl px-4"
                    />
                  </>
                }
              />
            </Col>
          ))}
        </Row>
      )}

      {/* ================= SHARE MODAL ================= */}
      <Modal
        open={isShareOpen}
        onCancel={() => setIsShareOpen(false)}
        footer={null}
        title={<Title level={4} className="m-0! font-black! uppercase tracking-tight">Share Resource</Title>}
        centered
        className="rounded-3xl overflow-hidden"
      >
        <div className="py-6">
          <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Select Recipients</Text>
          <div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
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
                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  selectedUsers.includes(u._id)
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white border-gray-100 hover:border-indigo-100 hover:bg-gray-50"
                }`}
              >
                <Avatar size="large" src={u.image} className="bg-indigo-100 text-indigo-600 font-bold">
                   {u.firstName[0]}
                </Avatar>
                <div className="flex flex-col">
                   <span className="font-bold text-gray-800 text-sm">
                     {u.firstName} {u.lastName}
                   </span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">AG-{u.agNo?.split('-AG-')[1] || "0000"}</span>
                </div>
                {selectedUsers.includes(u._id) && (
                   <div className="ml-auto w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button
          type="primary"
          onClick={shareNote}
          block
          size="large"
          className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-100"
        >
          Share with {selectedUsers.length} Students
        </Button>
      </Modal>
    </div>
  );
};

export default Shared;
