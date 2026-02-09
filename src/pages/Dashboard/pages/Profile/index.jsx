import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Button, Input, message, Spin, Select } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";

const { Option } = Select;

const Profile = () => {
  const { token, isAuth } = useAuthContext();
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    if (!isAuth) return;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setProfile(res.data.user);
        setFormData({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          email: res.data.user.email || "",
          degree: res.data.user.degree || "BSCS",
          semester: res.data.user.semester || "1",
          section: res.data.user.section || "",
          agNo: res.data.user.agNo || "",
          image: null,
        });
      } catch (err) {
        console.error(err);
        message.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, isAuth]);

  // ================= AUTH CHECK =================
  if (!isAuth)
    return (
      <h2 className="text-center mt-10 text-red-500 font-bold">
        Please login to view your profile
      </h2>
    );

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      const fd = new FormData();
      fd.append("firstName", formData.firstName);
      fd.append("lastName", formData.lastName);
      fd.append("email", formData.email);
      fd.append("degree", formData.degree);
      fd.append("semester", formData.semester);
      fd.append("section", formData.section);
      fd.append("agNo", formData.agNo);
      if (formData.image) fd.append("image", formData.image);

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/update`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setProfile(res.data.user);
      setEditMode(false);
      setPreview("");
      message.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-linear-to-r from-blue-100 via-white to-yellow-100 p-4 sm:p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center">
          <Spin size="large" />
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h2 className="text-xl font-bold">Welcome, {profile.firstName}</h2>
          <div className="flex gap-2">
            <Button
              loading={isLoading}
              icon={editMode ? <CheckOutlined /> : <EditOutlined />}
              type={editMode ? "primary" : "default"}
              onClick={() => (editMode ? handleUpdate() : setEditMode(true))}
            />
            {editMode && (
              <Button
                icon={<CloseOutlined />}
                onClick={() => {
                  setEditMode(false);
                  setPreview("");
                }}
              />
            )}
          </div>
        </div>

        {/* AVATAR */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8">
          <Avatar
            size={90}
            src={preview || profile.image}
            icon={<UserOutlined />}
            className="shadow-md"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 sm:mt-0 sm:ml-4"
            />
          )}
        </div>

        {/* FIELDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="First Name"
            name="firstName"
            editMode={editMode}
            formData={formData}
            handleChange={handleChange}
          />
          <Field
            label="Last Name"
            name="lastName"
            editMode={editMode}
            formData={formData}
            handleChange={handleChange}
          />
          <Field
            label="Email"
            name="email"
            editMode={false}
            formData={formData}
            handleChange={handleChange}
          />
          <Field
            label="Degree"
            name="degree"
            type="select"
            editMode={editMode}
            formData={formData}
            handleSelectChange={handleSelectChange}
            options={["BSSE"]}
          />
          <Field
            label="Semester"
            name="semester"
            type="select"
            editMode={editMode}
            formData={formData}
            handleSelectChange={handleSelectChange}
            options={["4"]}
          />
          <Field
            label="Section"
            name="section"
            type="select"
            editMode={editMode}
            formData={formData}
            handleSelectChange={handleSelectChange}
            options={["A", "B"]}
          />
          <Field
            label="AG Number"
            name="agNo"
            // editMode={editMode}
            formData={formData}
            handleChange={handleChange}
          />
          <div className="sm:col-span-2">
            <span className="text-gray-500 text-sm">Created At</span>
            <div className="bg-gray-50 p-3 rounded-lg">
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= FIELD COMPONENT =================
const Field = ({
  label,
  name,
  type = "text",
  editMode,
  formData,
  handleChange,
  handleSelectChange,
  options,
}) => {
  if (!editMode)
    return (
      <div>
        <span className="text-gray-500 text-sm">{label}</span>
        <div className="bg-gray-50 p-3 rounded-lg">
          {formData[name] || "N/A"}
        </div>
      </div>
    );

  if (type === "select")
    return (
      <div>
        <span className="text-gray-500 text-sm">{label}</span>
        <Select
          value={formData[name]}
          onChange={(val) => handleSelectChange(name, val)}
          className="w-full"
        >
          {options.map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Select>
      </div>
    );

  return (
    <div>
      <span className="text-gray-500 text-sm">{label}</span>
      <Input name={name} value={formData[name]} onChange={handleChange} />
    </div>
  );
};

export default Profile;
