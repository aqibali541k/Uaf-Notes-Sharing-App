import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Button, Input, message, Spin, Select, Card, Typography, Space, Divider, Row, Col } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  CameraOutlined,
  MailOutlined,
  IdcardOutlined,
  BookOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";
import { API_URL, COLORS } from "../../../../constants";

const { Option } = Select;
const { Title, Text } = Typography;

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
        const res = await axios.get(
          `${API_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

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
      } catch (err) {
        console.error(err);
        message.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, isAuth]);

  if (!isAuth)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <Card className="text-center rounded-3xl shadow-xl border-none p-10">
            <LockOutlined className="text-5xl text-red-400 mb-4" />
            <Title level={3}>Access Denied</Title>
            <Text className="text-gray-400">Please login to view your profile</Text>
         </Card>
      </div>
    );

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
        `${API_URL}/users/update`,
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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <Card className="rounded-[2.5rem] shadow-xl border-none overflow-hidden mb-8">
        <div className="h-32 bg-indigo-600 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <UserOutlined className="text-[120px] text-white" />
           </div>
        </div>
        
        <div className="px-8 pb-8">
           <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-16 gap-6 mb-8">
              <div className="relative group shrink-0">
                <Avatar
                  size={128}
                  src={preview || profile.image}
                  icon={<UserOutlined />}
                  className="border-8 border-white shadow-2xl bg-gray-50 shrink-0"
                />
                {editMode && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CameraOutlined className="text-white text-3xl" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>

              <div className="text-center sm:text-left flex-1 pb-4">
                <Title level={2} className="m-0! font-black! tracking-tight">{profile.firstName} {profile.lastName}</Title>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
                   <Space className="text-gray-400 font-bold text-xs uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                      <MailOutlined className="text-indigo-500" />
                      {profile.email}
                   </Space>
                   <Space className="text-gray-400 font-bold text-xs uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                      <IdcardOutlined className="text-indigo-500" />
                      {profile.agNo}
                   </Space>
                </div>
              </div>

              <div className="flex gap-3 pb-4">
                 {editMode ? (
                   <>
                     <Button 
                       type="primary" 
                       icon={<CheckOutlined />} 
                       onClick={handleUpdate}
                       loading={isLoading}
                       className="rounded-xl h-11 px-6 font-bold"
                       style={{ backgroundColor: COLORS.primary }}
                     >
                        Save Changes
                     </Button>
                     <Button 
                       icon={<CloseOutlined />} 
                       onClick={() => { setEditMode(false); setPreview(""); }}
                       className="rounded-xl h-11"
                     />
                   </>
                 ) : (
                   <Button 
                     type="primary" 
                     icon={<EditOutlined />} 
                     onClick={() => setEditMode(true)}
                     className="rounded-xl h-11 px-8 font-bold"
                     style={{ backgroundColor: COLORS.primary }}
                   >
                     Edit Profile
                   </Button>
                 )}
              </div>
           </div>

           <Divider className="m-0! opacity-50" />

           <div className="mt-10">
              <Row gutter={[48, 48]}>
                 <Col span={24} md={12}>
                    <Space direction="vertical" size="large" className="w-full">
                       <div>
                          <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Personal Information</Text>
                          <div className="space-y-6">
                             <EditableField 
                                label="First Name" 
                                name="firstName" 
                                value={formData.firstName} 
                                editMode={editMode} 
                                onChange={handleChange} 
                             />
                             <EditableField 
                                label="Last Name" 
                                name="lastName" 
                                value={formData.lastName} 
                                editMode={editMode} 
                                onChange={handleChange} 
                             />
                             <EditableField 
                                label="Email Address" 
                                name="email" 
                                value={formData.email} 
                                editMode={false} // Email locked for security usually
                                icon={<MailOutlined />}
                             />
                          </div>
                       </div>
                    </Space>
                 </Col>

                 <Col span={24} md={12}>
                    <Space direction="vertical" size="large" className="w-full">
                       <div>
                          <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Academic Details</Text>
                          <div className="space-y-6">
                             <div className="grid grid-cols-2 gap-4">
                               <EditableSelect 
                                  label="Degree" 
                                  name="degree" 
                                  value={formData.degree} 
                                  options={["BSCS", "BSIT", "BBA", "BSSE", "BSAI", "Other"]} 
                                  editMode={editMode} 
                                  onChange={handleSelectChange} 
                               />
                               <EditableSelect 
                                  label="Semester" 
                                  name="semester" 
                                  value={formData.semester} 
                                  options={["1", "2", "3", "4", "5", "6", "7", "8"]} 
                                  editMode={editMode} 
                                  onChange={handleSelectChange} 
                               />
                             </div>
                             <EditableSelect 
                                label="Section" 
                                name="section" 
                                value={formData.section} 
                                options={["A", "B"]} 
                                editMode={editMode} 
                                onChange={handleSelectChange} 
                             />
                             <EditableField 
                                label="AG Number" 
                                name="agNo" 
                                value={formData.agNo} 
                                editMode={editMode} 
                                onChange={(e) => setFormData(prev => ({ ...prev, agNo: e.target.value.toUpperCase() }))} 
                             />
                          </div>
                       </div>
                       
                       <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                          <Space className="text-gray-400">
                             <CalendarOutlined />
                             <Text className="text-[10px] font-bold uppercase tracking-widest">Joined On</Text>
                          </Space>
                          <Text className="font-bold text-gray-600">
                             {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "N/A"}
                          </Text>
                       </div>
                    </Space>
                 </Col>
              </Row>
           </div>
        </div>
      </Card>
      
      {isLoading && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-100 flex items-center justify-center">
          <Card className="rounded-3xl shadow-2xl p-8">
            <Spin size="large" />
            <div className="mt-4 font-bold text-indigo-600 uppercase tracking-widest text-[10px]">Processing...</div>
          </Card>
        </div>
      )}
    </div>
  );
};

const EditableField = ({ label, name, value, editMode, onChange, icon }) => (
  <div className="group">
    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">{label}</Text>
    {editMode ? (
      <Input
        name={name}
        value={value}
        onChange={onChange}
        prefix={icon}
        className="rounded-xl h-11 border-gray-100 focus:border-indigo-500 hover:border-indigo-400 transition-all shadow-sm"
      />
    ) : (
      <div className="h-11 flex items-center px-4 bg-gray-50/50 rounded-xl border border-gray-100 font-bold text-gray-700">
        {icon && <span className="mr-2 text-indigo-400">{icon}</span>}
        {value || <span className="text-gray-300 font-normal">Not provided</span>}
      </div>
    )}
  </div>
);

const EditableSelect = ({ label, name, value, options, editMode, onChange }) => (
  <div className="w-full">
    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">{label}</Text>
    {editMode ? (
      <Select
        value={value}
        onChange={(val) => onChange(name, val)}
        className="w-full h-11 rounded-xl"
        dropdownClassName="rounded-xl shadow-xl border-indigo-50"
      >
        {options.map((opt) => (
          <Option key={opt} value={opt}>{opt}</Option>
        ))}
      </Select>
    ) : (
      <div className="h-11 flex items-center px-4 bg-gray-50/50 rounded-xl border border-gray-100 font-bold text-gray-700">
        {value || <span className="text-gray-300 font-normal">N/A</span>}
      </div>
    )}
  </div>
);

export default Profile;
