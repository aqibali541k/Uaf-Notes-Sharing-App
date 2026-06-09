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
  ArrowLeftOutlined,
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
          `${API_URL}/users/all`,
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
        await axios.put(
          `${API_URL}/notes/update/${noteToEdit._id}`,
          fd,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        message.success("Note updated successfully ✅");
      } else {
        await axios.post(`${API_URL}/notes/create`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Note created successfully ✅");
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-500 hover:text-gray-800"
        >
          Back to Dashboard
        </Button>

        <Card className="rounded-2xl shadow-sm border-gray-200 overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white relative">
            <Title level={2} className="text-white! m-0! font-bold!">
              {noteToEdit ? "Edit Your Note" : "Share New Knowledge"}
            </Title>
            <p className="text-indigo-100 mt-2 opacity-90">
              {noteToEdit ? "Update your resource and visibility settings" : "Upload your notes and choose who can access them"}
            </p>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TeamOutlined style={{ fontSize: '100px' }} />
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* LEFT SIDE - Details */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Note Title</label>
                  <Input
                    size="large"
                    name="title"
                    placeholder="e.g. Statistical Inference Week 4"
                    value={state.title}
                    onChange={handleChange}
                    className="rounded-xl h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Category / Course</label>
                  <Select
                    size="large"
                    placeholder="Choose a course..."
                    value={state.category || undefined}
                    onChange={(value) =>
                      setState((s) => ({ ...s, category: value }))
                    }
                    className="w-full h-12"
                  >
                    {CATEGORIES.map(cat => (
                      <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {noteToEdit ? "Replace File (Optional)" : "Upload Document"}
                  </label>
                  <Dragger
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    showUploadList={false}
                    className="bg-gray-50 hover:bg-gray-100 transition-colors duration-300 rounded-2xl border-2 border-dashed"
                  >
                    <p className="ant-upload-drag-icon pt-4">
                      <UploadOutlined className="text-3xl text-indigo-500" />
                    </p>
                    <p className="ant-upload-text font-semibold pt-2">Click or drag PDF to upload</p>
                    <p className="ant-upload-hint pb-4 text-xs">Maximum file size: 10MB</p>
                  </Dragger>

                  {state.file && (
                    <div className="mt-4 flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <UploadOutlined className="text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 line-clamp-1">{state.file.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {(state.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => setState((s) => ({ ...s, file: null }))}
                        className="hover:bg-red-50"
                      />
                    </div>
                  )}

                  {noteToEdit?.fileUrl && !state.file && (
                    <div className="mt-4 flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl p-4">
                       <span className="text-sm font-medium text-amber-700 flex items-center gap-2">
                         <TeamOutlined /> Existing file is available
                       </span>
                       <Button
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(noteToEdit)}
                        className="rounded-lg border-amber-200 text-amber-700 hover:text-amber-800"
                      >
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE - Visibility */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <LockOutlined className="text-indigo-600" /> Visibility
                  </h3>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${state.isPrivate ? 'border-indigo-600 bg-white shadow-md' : 'border-gray-200 opacity-60'}`}
                      onClick={() => setState(s => ({ ...s, isPrivate: true, sharedWith: [] }))}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={state.isPrivate} className="pointer-events-none" />
                        <div>
                          <p className="font-bold text-sm">Private</p>
                          <p className="text-[10px] text-gray-500">Only shared users can see</p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${!state.isPrivate ? 'border-indigo-600 bg-white shadow-md' : 'border-gray-200 opacity-60'}`}
                      onClick={() => setState(s => ({ ...s, isPrivate: false }))}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={!state.isPrivate} className="pointer-events-none" />
                        <div>
                          <p className="font-bold text-sm">Public</p>
                          <p className="text-[10px] text-gray-500">Anyone can see and download</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {state.isPrivate && (
                    <div className="mt-8">
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Share with specific students</label>
                       <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                         {users.length === 0 ? (
                           <p className="text-center py-4 text-xs text-gray-400 italic">No students available</p>
                         ) : (
                           users.map((user) => (
                             <div 
                              key={user._id} 
                              className={`flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors cursor-pointer ${state.sharedWith.includes(user._id) ? 'bg-white shadow-sm' : ''}`}
                              onClick={() => {
                                const checked = !state.sharedWith.includes(user._id);
                                setState((s) => ({
                                  ...s,
                                  sharedWith: checked
                                    ? [...s.sharedWith, user._id]
                                    : s.sharedWith.filter((id) => id !== user._id),
                                }));
                              }}
                            >
                               <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                               <Checkbox checked={state.sharedWith.includes(user._id)} />
                             </div>
                           ))
                         )}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Divider className="my-10" />

            <div className="flex gap-4">
              <Button
                size="large"
                className="rounded-xl h-12 px-10 border-gray-300 text-gray-500 hover:text-gray-800"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleSubmit}
                className="flex-1 rounded-xl h-12 text-lg font-bold shadow-lg shadow-indigo-100"
                style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary }}
              >
                {noteToEdit ? "Update and Save Changes" : "Upload Note Now"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateNotes;
