import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Modal, Avatar, Tooltip } from "antd";
import {
  ShareAltOutlined,
  DeleteFilled,
  EditOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import SearchBar from "../SearchBar";
import { useAuthContext } from "../../../../context/AuthContext";

const Shared = () => {
  const { token, user } = useAuthContext();

  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", file: null });

  // Share
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch notes
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
      }
    };
    fetchNotes();
  }, [token]);

  // Fetch users
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

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notes/sharedD/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotes((prev) => prev.filter((n) => n._id !== id));
      message.success("Note deleted");
    } catch {
      message.error("You are not allowed to delete this note");
    }
  };

  // Share note
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

  const filteredNotes = notes.filter((n) =>
    n.title?.toLowerCase().includes((searchTerm || "").toLowerCase()),
  );

  return (
    <div className="mt-8 px-5">
      {notes.length > 0 && (
        <SearchBar onSearch={(v) => setSearchTerm(String(v))} />
      )}
      {notes.length === 0 && (
        <p className="text-center text-gray-500">No notes found</p>
      )}

      {/* Notes grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <FilePdfOutlined className="text-red-500 text-3xl" />
              <h2 className="text-lg font-semibold">{note.title}</h2>
            </div>

            <p className="text-xs text-gray-400 mb-2">
              Shared by{" "}
              {note.user?.firstName && note.user?.lastName
                ? `${note.user.firstName} ${note.user.lastName}`
                : "Unknown"}
            </p>

            <div className="flex flex-col gap-2">
              <a
                href={note.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View / Download PDF
              </a>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Tooltip title="Edit">
                <button
                  onClick={() => {
                    setActiveNote(note);
                    setFormData({ title: note.title, file: null });
                    setIsEditOpen(true);
                  }}
                  className="bg-green-500 p-2 rounded-xl text-white"
                >
                  <EditOutlined />
                </button>
              </Tooltip>

              <Tooltip title="Share">
                <button
                  onClick={() => {
                    setActiveNote(note);
                    setSelectedUsers([]);
                    setIsShareOpen(true);
                  }}
                  className="bg-indigo-500 p-2 rounded-xl text-white"
                >
                  <ShareAltOutlined />
                </button>
              </Tooltip>

              <Tooltip title="Delete">
                <button
                  onClick={() => deleteNote(note._id)}
                  className="bg-red-500 p-2 rounded-xl text-white"
                >
                  <DeleteFilled />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Note"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={async () => {
          try {
            const form = new FormData();
            form.append("title", formData.title);
            if (formData.file) form.append("pdf", formData.file);

            const res = await axios.put(
              `${import.meta.env.VITE_API_URL}/notes/update/${activeNote._id}`,
              form,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              },
            );

            setNotes((prev) =>
              prev.map((n) => (n._id === activeNote._id ? res.data.note : n)),
            );
            message.success("Note updated");
            setIsEditOpen(false);
          } catch {
            message.error("Update failed");
          }
        }}
      >
        <input
          className="w-full border p-2 rounded mb-3"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            setFormData({ ...formData, file: e.target.files[0] })
          }
        />
      </Modal>

      {/* Share Modal */}
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
          className="w-full mt-3 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
        >
          Share ({selectedUsers.length})
        </button>
      </Modal>
    </div>
  );
};

export default Shared;
