import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar, Button, Input, message, Spin, Select, Card, Typography, Space, Divider, Row, Col,
} from "antd";
import {
  EditOutlined, CheckOutlined, CloseOutlined, UserOutlined, CameraOutlined,
  MailOutlined, IdcardOutlined, CalendarOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";
import { API_URL, COLORS } from "../../../../constants";

const { Option } = Select;
const { Text } = Typography;

const Profile = () => {
  const { token, isAuth, user } = useAuthContext();
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuth) return;
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.user);
        setFormData({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          email: res.data.user.email || "",
          degree: res.data.user.degree || "BSSE",
          semester: res.data.user.semester || "1",
          section: res.data.user.section || "",
          agNo: res.data.user.agNo || "",
          image: null,
        });
      } catch {
        message.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token, isAuth]);

  if (!isAuth) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="text-center rounded-xl border border-gray-200 shadow-sm p-8">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </Card>
    </div>
  );

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelectChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));
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

      const res = await axios.put(`${API_URL}/users/update`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data.user);
      setEditMode(false);
      setPreview("");
      message.success("Profile updated");
    } catch (err) {
      message.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-indigo-600" />

        <div className="px-6 pb-8">
          {/* Avatar + Name + Actions */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 gap-4 mb-6">
            <div className="relative group shrink-0">
              <Avatar
                size={96}
                src={preview || profile.image}
                icon={<UserOutlined />}
                className="border-4 border-white shadow-md bg-gray-100"
              />
              {editMode && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <CameraOutlined className="text-white text-xl" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>

            <div className="text-center sm:text-left flex-1 pb-2">
              <h1 className="text-lg font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1.5">
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">
                  <MailOutlined className="text-indigo-500" style={{ fontSize: 11 }} /> {profile.email}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">
                  <IdcardOutlined className="text-indigo-500" style={{ fontSize: 11 }} /> {profile.agNo || "—"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pb-2 shrink-0">
              {editMode ? (
                <>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleUpdate}
                    loading={isLoading}
                    className="rounded-lg h-9 px-5 font-medium"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    Save
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() => { setEditMode(false); setPreview(""); }}
                    className="rounded-lg h-9"
                  />
                </>
              ) : (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(true)}
                  className="rounded-lg h-9 px-5 font-medium"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <Divider className="my-0 opacity-60" />

          <div className="mt-6">
            <Row gutter={[40, 32]}>
              <Col span={24} md={12}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Personal Information</p>
                <div className="space-y-4">
                  <EditableField label="First Name" name="firstName" value={formData.firstName} editMode={editMode} onChange={handleChange} />
                  <EditableField label="Last Name" name="lastName" value={formData.lastName} editMode={editMode} onChange={handleChange} />
                  <EditableField label="Email Address" name="email" value={formData.email} editMode={false} icon={<MailOutlined />} />
                </div>
              </Col>

              <Col span={24} md={12}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Academic Details</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <EditableSelect label="Degree" name="degree" value={formData.degree} options={["BSCS", "BSIT", "BBA", "BSSE", "BSAI", "Other"]} editMode={editMode} onChange={handleSelectChange} />
                    <EditableSelect label="Semester" name="semester" value={formData.semester} options={["1","2","3","4","5","6","7","8"]} editMode={editMode} onChange={handleSelectChange} />
                  </div>
                  <EditableSelect label="Section" name="section" value={formData.section} options={["A", "B"]} editMode={editMode} onChange={handleSelectChange} />
                  <EditableField
                    label="AG Number"
                    name="agNo"
                    value={formData.agNo}
                    editMode={editMode}
                    onChange={(e) => setFormData((p) => ({ ...p, agNo: e.target.value.toUpperCase() }))}
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <CalendarOutlined /> Joined
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                        : "—"}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const EditableField = ({ label, name, value, editMode, onChange, icon }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
    {editMode ? (
      <Input
        name={name}
        value={value}
        onChange={onChange}
        prefix={icon}
        className="rounded-lg h-9 border-gray-200 focus:border-indigo-500 hover:border-indigo-400 transition-colors"
      />
    ) : (
      <div className="h-9 flex items-center px-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
        {icon && <span className="mr-2 text-indigo-400">{icon}</span>}
        {value || <span className="text-gray-300">Not provided</span>}
      </div>
    )}
  </div>
);

const EditableSelect = ({ label, name, value, options, editMode, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
    {editMode ? (
      <Select
        value={value}
        onChange={(val) => onChange(name, val)}
        className="w-full h-9"
      >
        {options.map((opt) => <Option key={opt} value={opt}>{opt}</Option>)}
      </Select>
    ) : (
      <div className="h-9 flex items-center px-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
        {value || <span className="text-gray-300">N/A</span>}
      </div>
    )}
  </div>
);

export default Profile;
