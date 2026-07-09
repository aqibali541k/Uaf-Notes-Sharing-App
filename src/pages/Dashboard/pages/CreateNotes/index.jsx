import React, { useState, useEffect } from "react";
import {
  Button, Card, Input, message, Checkbox, Upload, Select, Divider,
} from "antd";
import {
  UploadOutlined, LockOutlined, TeamOutlined, DeleteOutlined,
  DownloadOutlined, ArrowLeftOutlined, PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL, CATEGORIES, COLORS } from "../../../../constants";

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
  const navigate = useNavigate();
  const noteToEdit = location.state?.noteToEdit;

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(initialState);
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch {
        message.error("Failed to fetch users");
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "isPrivate") {
      setState((s) => ({ ...s, isPrivate: checked, sharedWith: [] }));
    } else {
      setState((s) => ({ ...s, [name]: value }));
    }
  };

  const beforeUpload = (file) => {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error("File must be smaller than 10MB");
      return Upload.LIST_IGNORE;
    }
    setState((s) => ({ ...s, file }));
    return false;
  };

  const handleSubmit = async () => {
    if (!state.title.trim()) return message.warning("Title is required");
    if (!state.category) return message.warning("Category is required");
    if (!noteToEdit && !state.file) return message.warning("Please upload a file");

    const fd = new FormData();
    fd.append("title", state.title);
    fd.append("category", state.category);
    fd.append("isPrivate", state.isPrivate);
    fd.append("sharedWith", JSON.stringify(state.sharedWith));
    if (state.file) fd.append("file", state.file);

    try {
      setLoading(true);
      if (noteToEdit) {
        await axios.put(`${API_URL}/notes/update/${noteToEdit._id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Note updated");
      } else {
        await axios.post(`${API_URL}/notes/create`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Note uploaded");
      }
      navigate(-1);
    } catch (err) {
      message.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (note) => {
    try {
      const res = await axios.get(note.fileUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${note.title}.${note.fileExt || "file"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      message.error("Failed to download file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back + Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800 -ml-2"
          />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {noteToEdit ? "Edit Note" : "Upload Note"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {noteToEdit
                ? "Update your resource and visibility settings"
                : "Upload your notes and choose who can access them"}
            </p>
          </div>
        </div>

        <Card className="rounded-xl border border-gray-200 shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-2">
            {/* LEFT — Details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Note Title</label>
                <Input
                  name="title"
                  placeholder="e.g. Statistical Inference — Week 4"
                  value={state.title}
                  onChange={handleChange}
                  className="rounded-lg h-9"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category / Course</label>
                <Select
                  placeholder="Choose a course…"
                  value={state.category || undefined}
                  onChange={(value) => setState((s) => ({ ...s, category: value }))}
                  className="w-full h-9"
                >
                  {CATEGORIES.map((cat) => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {noteToEdit ? "Replace File (optional)" : "Upload Document"}
                </label>
                <Dragger
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  showUploadList={false}
                  className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-white transition-colors"
                >
                  <p className="ant-upload-drag-icon pt-4">
                    <UploadOutlined className="text-2xl text-indigo-500" />
                  </p>
                  <p className="ant-upload-text text-sm font-medium pb-1">Click or drag file to upload</p>
                  <p className="ant-upload-hint pb-4 text-xs text-gray-400">Max 10MB</p>
                </Dragger>

                {state.file && (
                  <div className="mt-3 flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-white border border-indigo-100 rounded-lg flex items-center justify-center">
                        <UploadOutlined className="text-indigo-500 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{state.file.name}</p>
                        <p className="text-xs text-gray-400">{(state.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => setState((s) => ({ ...s, file: null }))}
                    />
                  </div>
                )}

                {noteToEdit?.fileUrl && !state.file && (
                  <div className="mt-3 flex items-center justify-between bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <span className="text-sm font-medium text-amber-700 flex items-center gap-2">
                      <TeamOutlined /> Existing file available
                    </span>
                    <Button
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(noteToEdit)}
                      className="rounded-md border-amber-200 text-amber-700"
                    >
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Visibility */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                  <LockOutlined className="text-indigo-600" /> Visibility
                </h3>

                <div className="space-y-2">
                  <div
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      state.isPrivate ? "border-indigo-600 bg-white" : "border-gray-200 opacity-60 hover:opacity-80"
                    }`}
                    onClick={() => setState((s) => ({ ...s, isPrivate: true, sharedWith: [] }))}
                  >
                    <div className="flex items-center gap-2.5">
                      <Checkbox checked={state.isPrivate} className="pointer-events-none" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Private</p>
                        <p className="text-xs text-gray-500">Only shared contacts can view</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      !state.isPrivate ? "border-indigo-600 bg-white" : "border-gray-200 opacity-60 hover:opacity-80"
                    }`}
                    onClick={() => setState((s) => ({ ...s, isPrivate: false }))}
                  >
                    <div className="flex items-center gap-2.5">
                      <Checkbox checked={!state.isPrivate} className="pointer-events-none" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Public</p>
                        <p className="text-xs text-gray-500">Anyone can view and download</p>
                      </div>
                    </div>
                  </div>
                </div>

                {state.isPrivate && (
                  <div className="mt-5">
                    <label className="block text-xs font-medium text-gray-500 mb-3">Share with students</label>
                    <div className="max-h-52 overflow-y-auto space-y-1">
                      {users.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-3">No students available</p>
                      ) : (
                        users.map((u) => (
                          <div
                            key={u._id}
                            className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                              state.sharedWith.includes(u._id) ? "bg-indigo-50" : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              const checked = !state.sharedWith.includes(u._id);
                              setState((s) => ({
                                ...s,
                                sharedWith: checked
                                  ? [...s.sharedWith, u._id]
                                  : s.sharedWith.filter((id) => id !== u._id),
                              }));
                            }}
                          >
                            <span className="text-sm text-gray-700">{u.firstName} {u.lastName}</span>
                            <Checkbox checked={state.sharedWith.includes(u._id)} className="pointer-events-none" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Divider className="my-6" />

          <div className="flex gap-3 px-2 pb-2">
            <Button
              className="rounded-lg h-9 px-6 border-gray-200 text-gray-600"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
              className="flex-1 rounded-lg h-9 text-sm font-medium border-none"
              style={{ backgroundColor: COLORS.primary }}
            >
              {noteToEdit ? "Save Changes" : "Upload Note"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateNotes;
