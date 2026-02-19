import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Modal, Avatar, Tooltip, Button, Spin } from "antd";
import {
  ShareAltOutlined,
  DeleteFilled,
  FilePdfOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileUnknownOutlined,
  DownloadOutlined,
  // FileVideoOutlined,
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
          `${import.meta.env.VITE_API_URL}/users/all`,
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
        `${import.meta.env.VITE_API_URL}/notes/sharedD/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotes((prev) => prev.filter((n) => n._id !== id));
      message.success("Note deleted");
    } catch (err) {
      console.error(err);
      message.error("something went wrong while deleting note");
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

  // ================= GET ICON =================
  const getFileIcon = (type) => {
    if (!type)
      return <FileUnknownOutlined className="text-gray-600 text-2xl" />;

    if (type.includes("pdf"))
      return <FilePdfOutlined className="text-red-600 text-2xl" />;
    if (type.includes("image"))
      return <FileImageOutlined className="text-green-600 text-2xl" />;
    if (type.includes("video"))
      return <FileVideoOutlined className="text-purple-600 text-2xl" />;
    if (type.includes("zip") || type.includes("rar"))
      return <FileZipOutlined className="text-yellow-600 text-2xl" />;
    if (type.includes("word") || type.includes("doc"))
      return <FileWordOutlined className="text-blue-600 text-2xl" />;
    if (type.includes("excel") || type.includes("sheet"))
      return <FileExcelOutlined className="text-green-700 text-2xl" />;

    return <FileTextOutlined className="text-gray-500 text-2xl" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spin size="large" />
        <p className="text-gray-500 tracking-wide">Loading shared notes...</p>
      </div>
    );
  }

  return (
    <div className="mt-8 px-5 max-w-7xl mx-auto">
      {/* SEARCH BAR */}
      {notes.length > 0 && (
        <SearchBar onSearch={(v) => setSearchTerm(String(v))} />
      )}

      {notes.length === 0 && (
        <p className="text-center text-gray-500 mt-20 text-lg">
          No shared notes available
        </p>
      )}

      {/* ================= NOTES GRID ================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="
              relative overflow-hidden
              bg-gradient-to-br from-[#faf7f2] via-white to-[#f5efe6]
              border border-gray-200
              rounded-3xl p-6
              shadow-lg
              hover:shadow-2xl
              transition-transform duration-300
              hover:-translate-y-2
              group
            "
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-t-xl" />

            {/* Glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl group-hover:scale-125 transition-transform" />

            {/* Title & Icon */}
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gray-100 shadow-inner">
                {getFileIcon(note.fileType)}
              </div>
              <h2 className="text-lg font-bold text-gray-800 tracking-wide truncate">
                {note.title}
              </h2>
            </div>

            {/* File type */}
            <p className="text-xs text-gray-400 mb-4">
              Type: {note.fileExt?.toUpperCase() || "Unknown"}
            </p>

            {/* Author */}
            <p className="text-xs text-gray-500 italic mb-4">
              Shared by{" "}
              <span className="font-semibold text-gray-700">
                {note.user?.firstName} {note.user?.lastName}
              </span>
            </p>

            {/* Download button */}
            <Button
              loading={downloadingId === note._id}
              onClick={() => handleDownload(note)}
              className="
                w-full flex items-center justify-center gap-2
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-purple-600 hover:to-pink-600
                text-white font-semibold
                rounded-2xl py-3
                shadow-lg
                transition-all duration-300 hover:scale-[1.03]
              "
            >
              <DownloadOutlined />
              {downloadingId === note._id
                ? "Downloading..."
                : `Download ${note.fileExt?.toUpperCase() || "File"}`}
            </Button>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-5">
              <Tooltip title="Share">
                <button
                  onClick={() => {
                    setActiveNote(note);
                    setSelectedUsers(note.sharedWith?.map((u) => u._id) || []);
                    setIsShareOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-purple-400 hover:bg-cyan-400 transition text-white"
                >
                  <ShareAltOutlined />
                </button>
              </Tooltip>

              <Tooltip title="Delete">
                <button
                  onClick={() => deleteNote(note._id)}
                  className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition"
                >
                  <DeleteFilled />
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
        title="Share Note"
        centered
      >
        <div className="flex flex-col gap-2">
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
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
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

        <Button
          type="primary"
          onClick={shareNote}
          className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
        >
          Share ({selectedUsers.length})
        </Button>
      </Modal>
    </div>
  );
};

export default Shared;
