import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Input,
  message,
  Checkbox,
  Upload,
  Select,
  Divider,
} from "antd";
import Title from "antd/es/typography/Title";
import {
  UploadOutlined,
  LockOutlined,
  TeamOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { useLocation } from "react-router-dom";

const { Option } = Select;
const { Dragger } = Upload;

const initialState = {
  title: "",
  category: "",
  file: null,
  isPrivate: true,
  sharedWith: [],
};

const CreateNotes = () => {
  const { token } = useAuthContext();
  const location = useLocation();
  const noteToEdit = location.state?.noteToEdit;

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(initialState);
  const [users, setUsers] = useState([]);

  // Load edit data
  useEffect(() => {
    if (noteToEdit) {
      setState({
        title: noteToEdit.title || "",
        category: noteToEdit.category || "",
        file: null,
        isPrivate: noteToEdit.isPrivate,
        sharedWith: noteToEdit.sharedWith?.map((u) => u._id) || [],
      });
    }
  }, [noteToEdit]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/all`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUsers(res.data.users || []);
      } catch {
        message.error("Failed to fetch users");
      }
    };

    if (token) fetchUsers();
  }, [token]);

  // Handle input
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "isPrivate") {
      setState((s) => ({ ...s, isPrivate: checked, sharedWith: [] }));
    } else {
      setState((s) => ({ ...s, [name]: value }));
    }
  };

  // File upload validation
  const beforeUpload = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error("File must be smaller than 10MB ❌");
      return Upload.LIST_IGNORE;
    }
    setState((s) => ({ ...s, file }));
    return false;
  };

  // Submit
  const handleSubmit = async () => {
    if (!state.title.trim()) return message.warning("Title is required");
    if (!state.category) return message.warning("Category is required");

    const fd = new FormData();
    fd.append("title", state.title);
    fd.append("category", state.category);
    fd.append("isPrivate", state.isPrivate);
    fd.append("sharedWith", JSON.stringify(state.sharedWith));
    if (state.file) fd.append("file", state.file);

    try {
      setLoading(true);

      if (noteToEdit) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/notes/update/${noteToEdit._id}`,
          fd,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        message.success("Note updated successfully ✅");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/notes/create`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Note created successfully ✅");
      }

      setState(initialState);
    } catch (err) {
      message.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DOWNLOAD FUNCTION ----------------
  const handleDownload = async (note) => {
    try {
      const res = await axios.get(note.fileUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = note.title + "." + (note.fileExt || "file");
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      message.error("Failed to download file");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-blue-500 to-purple-600 p-6">
      <Card className="w-full max-w-4xl rounded-3xl shadow-2xl border-0 p-8 bg-white/95 backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2}>
            {noteToEdit ? "✏️ Edit Notes" : "📚 Create Notes"}
          </Title>
          <p className="text-gray-500">
            Upload any file, control privacy & share securely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT SIDE */}
          <div className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">Note Title</label>
              <Input
                size="large"
                name="title"
                placeholder="Enter note title..."
                value={state.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Category</label>
              <Select
                size="large"
                placeholder="Select Category"
                value={state.category}
                onChange={(value) =>
                  setState((s) => ({ ...s, category: value }))
                }
                className="w-full"
              >
                <Option value="Stat-402">Stat-402</Option>
                <Option value="Cs-408">Cs-408</Option>
                <Option value="Cs-412">Cs-412</Option>
                <Option value="Cs-410">Cs-410</Option>
                <Option value="Cs-406">Cs-406</Option>
                <Option value="Bms-402">Bms-402</Option>
                <Option value="Is-402">Is-402</Option>
                <Option value="Announcements">Announcements</Option>
              </Select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Upload File (Any Type, Max 10MB)
              </label>
              <Dragger
                beforeUpload={beforeUpload}
                maxCount={1}
                showUploadList={false}
                onRemove={() => setState((s) => ({ ...s, file: null }))}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 40 }} />
                </p>
                <p className="ant-upload-text">Click or drag file to upload</p>
                <p className="ant-upload-hint">Supports any file format</p>
              </Dragger>

              {state.file && (
                <div className="mt-3 flex items-center justify-between bg-gray-100 rounded-lg p-3">
                  <span className="truncate text-sm">📎 {state.file.name}</span>
                  <DeleteOutlined
                    onClick={() => setState((s) => ({ ...s, file: null }))}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Download existing note file */}
              {noteToEdit?.fileUrl && (
                <Button
                  icon={<DownloadOutlined />}
                  className="mt-2"
                  onClick={() => handleDownload(noteToEdit)}
                >
                  Download Existing File
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <LockOutlined className="text-lg" />
              <Checkbox
                name="isPrivate"
                checked={state.isPrivate}
                onChange={handleChange}
              >
                Keep this note private
              </Checkbox>
            </div>

            {!state.isPrivate && (
              <>
                <Divider />
                <div>
                  <label className="block mb-3 font-medium">
                    <TeamOutlined /> Share With
                  </label>
                  <div className="max-h-48 overflow-y-auto border rounded-lg p-3">
                    {users.length === 0 && (
                      <p className="text-gray-400 text-sm">
                        No users available
                      </p>
                    )}
                    {users.map((user) => (
                      <Checkbox
                        key={user._id}
                        checked={state.sharedWith.includes(user._id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setState((s) => ({
                            ...s,
                            sharedWith: checked
                              ? [...s.sharedWith, user._id]
                              : s.sharedWith.filter((id) => id !== user._id),
                          }));
                        }}
                        className="block mb-2"
                      >
                        {user.name}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={handleSubmit}
          className="w-full mt-10 rounded-xl text-lg h-12"
        >
          {noteToEdit ? "Update Note" : "Create Note"}
        </Button>
      </Card>
    </div>
  );
};

export default CreateNotes;
