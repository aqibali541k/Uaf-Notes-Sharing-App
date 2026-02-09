import React, { useState, useEffect } from "react";
import { Button, Card, Input, message, Checkbox, Upload, Select } from "antd";
import Title from "antd/es/typography/Title";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { UploadOutlined, LockOutlined } from "@ant-design/icons";

const { Option } = Select; // ✅ Added for Select

const initialState = {
  title: "",
  subject: "",
  category: "", // ✅ Added category
  file: null,
  isPrivate: true,
  sharedWith: [],
};

const CreateNotes = () => {
  const { token } = useAuthContext();
  const location = useLocation();
  const noteToEdit = location.state?.noteToEdit;

  const [state, setState] = useState(initialState);
  const [users, setUsers] = useState([]);

  // Load existing note data if editing
  useEffect(() => {
    if (noteToEdit) {
      setState({
        title: noteToEdit.title || "",
        subject: noteToEdit.subject || "",
        category: noteToEdit.category || "", // ✅ pre-fill category
        file: null, // user can re-upload
        isPrivate: noteToEdit.isPrivate,
        sharedWith: noteToEdit.sharedWith?.map((u) => u._id) || [],
      });
    }
  }, [noteToEdit]);

  // Fetch users for sharing
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
    fetchUsers();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "isPrivate") {
      setState((s) => ({ ...s, isPrivate: checked }));
    } else if (name.startsWith("share_")) {
      const id = name.split("_")[1];
      setState((s) => ({
        ...s,
        sharedWith: checked
          ? [...s.sharedWith, id]
          : s.sharedWith.sw((uid) => uid !== id),
      }));
    } else {
      setState((s) => ({ ...s, [name]: value }));
    }
  };

  // Handle file upload
  const beforeUpload = (file) => {
    //  only pdf files are allowed
    if (!file.type.startsWith("application/pdf")) {
      message.error("Only PDF files are allowed ❌");
      return Upload.LIST_IGNORE;
    }
    setState((s) => ({ ...s, file }));
    return false;
  };

  // Submit
  const handleSubmit = async () => {
    if (!state.title) return message.warning("Title is required");
    if (!state.category) return message.warning("Category is required"); // ✅ Validate category

    const fd = new FormData();
    fd.append("title", state.title);
    fd.append("subject", state.subject);
    fd.append("category", state.category); // ✅ Add category to FormData
    fd.append("isPrivate", state.isPrivate);
    fd.append("sharedWith", JSON.stringify(state.sharedWith));
    if (state.file) fd.append("pdf", state.file);

    try {
      if (noteToEdit) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/notes/update/${noteToEdit._id}`,
          fd,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        message.success("Note updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/notes/create`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Note created successfully");
      }
      setState(initialState);
    } catch (err) {
      message.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center from-indigo-600 via-blue-600 to-purple-600 p-4 md:p-10">
      <Card
        className="w-full max-w-4xl rounded-3xl shadow-2xl border-0 backdrop-blur-md"
        style={{ padding: "24px", md: "36px" }}
      >
        {/* Title */}
        <div className="text-center mb-6 md:mb-8">
          <Title level={2} className="mb-1! text-lg! sm:text-sm! md:text-2xl!">
            {noteToEdit ? "✏️ Edit Notes" : "Create Notes"}
          </Title>
          <p className="text-green-400 text-sm sm:text-base">
            Upload files, manage privacy & share securely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* LEFT */}
          <div className="space-y-4">
            <label className="block mb-1 font-medium">Note Title</label>
            <Input
              size="large"
              name="title"
              placeholder="Note Title"
              value={state.title}
              onChange={handleChange}
              className="mb-2!"
            />

            {/* Category Select */}
            <div className="w-full">
              <label className="block mb-1 font-medium">Category</label>
              <Select
                size="large"
                placeholder="Select Category"
                value={state.category}
                onChange={(value) =>
                  setState((s) => ({ ...s, category: value }))
                }
                className="w-full rounded-lg text-gray-900"
              >
                <Option value="">Select subject</Option>
                <Option value="Statistics">Statistics</Option>
                <Option value="Cs-412">Cs-412</Option>
                <Option value="Database">Database</Option>
                <Option value="Dsa">Dsa</Option>
                <Option value="Virtual Programming">Virtual Programming</Option>
                <Option value="Enterpreneurship">Enterpreneurship</Option>
                <Option value="Announcements">Announcements</Option>
              </Select>
            </div>

            <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              onRemove={() => setState((s) => ({ ...s, file: null }))}
            >
              <Button icon={<UploadOutlined />} size="large" className="w-full">
                Choose File
              </Button>
            </Upload>

            {state.file && (
              <p className="text-sm text-green-400 truncate">
                Selected: {state.file.name}
              </p>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LockOutlined className="text-white" />
              <Checkbox
                name="isPrivate"
                checked={state.isPrivate}
                onChange={handleChange}
                className="text-white"
              >
                Keep this note private
              </Checkbox>
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="primary"
          size="large"
          className="w-full mt-6 md:mt-8 rounded-xl text-lg"
          onClick={handleSubmit}
        >
          {noteToEdit ? "Update Note " : "Create Note "}
        </Button>
      </Card>
    </div>
  );
};

export default CreateNotes;
