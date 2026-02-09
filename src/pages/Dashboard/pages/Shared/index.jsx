import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Modal, Avatar, Tooltip, Button, Spin } from "antd";
import {
  ShareAltOutlined,
  DeleteFilled,
  FilePdfOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import SearchBar from "../SearchBar";
import { useAuthContext } from "../../../../context/AuthContext";

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
          `${import.meta.env.VITE_API_URL}/notes/shared`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setNotes(res.data.notes || []);
      } catch {
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
          `${import.meta.env.VITE_API_URL}/users/all`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUsers(res.data.users.filter((u) => u._id !== user._id));
      } catch {
        message.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [token, user._id]);

  // ================= DELETE NOTE =================
  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notes/sharedD/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotes((prev) => prev.filter((n) => n._id !== id));
      message.success("Note deleted");
    } catch {
      message.error("You are not allowed to delete this note");
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
        `${import.meta.env.VITE_API_URL}/notes/share/${activeNote._id}`,
        { sharedWith: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setNotes((prev) =>
        prev.map((n) => (n._id === activeNote._id ? res.data.note : n)),
      );
      message.success("Note shared");
      setSelectedUsers([]);
      setIsShareOpen(false);
    } catch {
      message.error("You are not allowed to share this note");
    }
  };

  // ================= DOWNLOAD PDF (BLOB SAFE) =================
  const handleDownload = async (pdfUrl, title, id) => {
    try {
      setDownloadingId(id);

      const response = await axios.get(pdfUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch {
      message.error("Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  // ================= SEARCH FILTER =================
  const filteredNotes = notes.filter((n) =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spin size="large" />
        <p className="text-gray-500 tracking-wide">Loading shared notes...</p>
      </div>
    );
  }
  return (
    <div className="mt-8 px-5">
      {notes.length > 0 && (
        <SearchBar onSearch={(v) => setSearchTerm(String(v))} />
      )}

      {notes.length === 0 && (
        <p className="text-center text-gray-500 mt-20">No notes found</p>
      )}

      {/* ================= NOTES GRID ================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="
              relative overflow-hidden
              bg-linear-to-br from-[#faf7f2] via-white to-[#f5efe6]
              border border-gray-200
              rounded-3xl p-6
              shadow-[0_20px_40px_rgba(0,0,0,0.08)]
              hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)]
              transition-all duration-500
              hover:-translate-y-2
              group
            "
          >
            {/* Top antique line */}

            <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-amber-500 via-rose-500 to-purple-600" />

            {/* Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl group-hover:scale-125 transition" />

            {/* Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-red-100 shadow-inner">
                <FilePdfOutlined className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 tracking-wide">
                {note.title}
              </h2>
            </div>

            {/* Author */}
            <p className="text-xs text-gray-500 italic mb-4">
              Shared by{" "}
              <span className="font-semibold text-gray-700">
                {note.user?.firstName} {note.user?.lastName}
              </span>
            </p>

            {/* Download Button */}
            <Button
              loading={downloadingId === note._id}
              onClick={() => handleDownload(note.pdfUrl, note.title, note._id)}
              className="
                w-full!
                flex! items-center! justify-center! gap-2!
                bg-linear-to-r! from-indigo-600! to-purple-600!
                hover:from-purple-600! hover:to-pink-600!
                text-white! font-semibold!
                rounded-2xl! py-3!
                shadow-lg!
                transition-all! duration-300!
                hover:scale-[1.03]
              "
            >
              <DownloadOutlined />
              {downloadingId === note._id ? "Downloading..." : "Download PDF"}
            </Button>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-5">
              <Tooltip title="Share">
                <button
                  onClick={() => {
                    setActiveNote(note);
                    setSelectedUsers([]);
                    setIsShareOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-purple-400 border-none cursor-pointer backdrop-blur border hover:bg-cyan-400 transition"
                >
                  <ShareAltOutlined className="text-indigo-600" />
                </button>
              </Tooltip>

              <Tooltip title="Delete">
                <button
                  onClick={() => deleteNote(note._id)}
                  className="p-3 rounded-2xl bg-red-600 text-white border-none cursor-pointer backdrop-blur border hover:bg-red-700 transition"
                >
                  <DeleteFilled className="text-white" />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {/* ================= SHARE MODAL ================= */}
      <Modal
        open={isShareOpen}
        onCancel={() => setIsShareOpen(false)}
        footer={null}
      >
        <h3 className="text-center font-semibold mb-3">Share with</h3>

        <div className="max-h-64 overflow-y-auto">
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
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                selectedUsers.includes(u._id)
                  ? "bg-indigo-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <Avatar>{u.firstName[0]}</Avatar>
              <span className="font-medium">
                {u.firstName} {u.lastName}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={shareNote}
          className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
        >
          Share ({selectedUsers.length})
        </button>
      </Modal>
    </div>
  );
};

export default Shared;
