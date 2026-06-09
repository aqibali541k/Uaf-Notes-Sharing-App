import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Typography,
  Card,
  Avatar,
  Divider,
} from "antd";
const { Option } = Select;
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { UserOutlined, CameraOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { API_URL, COLORS } from "../../../constants";

const { Title, Text } = Typography;

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  degree: "",
  semester: "",
  section: "",
  agNo: "",
  password: "",
  confirmPassword: "",
  image: null,
};

const Register = () => {
  const { handleRegister } = useAuthContext();
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (name === "image") setState((prev) => ({ ...prev, image: files[0] }));
  };

  const handleSubmit = async () => {
    try {
      const {
        firstName,
        lastName,
        email,
        degree,
        semester,
        section,
        agNo,
        password,
        confirmPassword,
        image,
      } = state;
      
      if (!firstName || !email || !degree || !semester || !section || !agNo || !password || !confirmPassword) {
        return message.error("All fields are required");
      }
      
      if (password !== confirmPassword) return message.error("Passwords do not match");
      
      const agRegex = /^\d{4}-AG-\d{4,5}$/;
      if (!agRegex.test(agNo.toUpperCase())) {
        return message.error("AG No must be in format 0000-AG-0000");
      }

      const parts = agNo.split("-");
      const year = parseInt(parts[0], 10);
      const number = parseInt(parts[2], 10);
      
      // Keep authorized range logic for university rules
      if (!((year === 2024 && number >= 4098) || (year === 2024 && number <= 6013))) {
        return message.error("You are not Authorized");
      }

      setIsProcessing(true);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("degree", degree);
      formData.append("semester", semester);
      formData.append("section", section.toUpperCase());
      formData.append("agNo", agNo.toUpperCase());
      formData.append("password", password);
      if (image) formData.append("image", image);

      const res = await axios.post(`${API_URL}/users/register`, formData);

      const { user, token } = res.data;
      handleRegister(user, token);
      message.success("Account created successfully!");
      
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/dashboard");

    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 shadow-inner">
       <div className="fixed top-0 left-0 w-full h-1 bg-indigo-600 z-50" />
       
       <div className="max-w-2xl w-full">
          <Link to="/auth/login" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors mb-8 group">
            <ArrowLeftOutlined className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          <Card className="rounded-4xl shadow-2xl border-none p-2 sm:p-4 overflow-hidden">
            <div className="text-center py-10 px-6 sm:px-12 bg-white rounded-t-4xl">
              <Title level={2} className="font-black! tracking-tight m-0!">
                Join the <span className="text-indigo-600">Knowledge Network</span>
              </Title>
              <Text className="text-gray-400 mt-2 block">Create your student profile to start sharing notes</Text>
              
              {/* Profile Image Picker */}
              <div className="mt-8 flex justify-center">
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="w-24 h-24 rounded-full border-4 border-indigo-50 flex items-center justify-center bg-gray-50 overflow-hidden shadow-inner transition-all duration-300 group-hover:border-indigo-100">
                    {state.image ? (
                      <img src={URL.createObjectURL(state.image)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserOutlined className="text-3xl text-gray-300" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                    <CameraOutlined className="text-xs" />
                  </div>
                  <input type="file" name="image" accept="image/*" ref={fileInputRef} onChange={handleChange} className="hidden" />
                </div>
              </div>
            </div>

            <Divider className="m-0!" />

            <div className="p-8 sm:p-12">
              <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} className="space-y-6">
                <Row gutter={24}>
                  <Col span={24} sm={12}>
                    <Form.Item label={<Text className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">First Name</Text>}>
                      <Input
                        size="large"
                        placeholder="John"
                        value={state.firstName}
                        onChange={(e) => setState(prev => ({ ...prev, firstName: e.target.value }))}
                        className="rounded-xl h-12 border-gray-100 focus:border-indigo-500"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={12}>
                    <Form.Item label={<Text className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Last Name</Text>}>
                      <Input
                        size="large"
                        placeholder="Doe"
                        value={state.lastName}
                        onChange={(e) => setState(prev => ({ ...prev, lastName: e.target.value }))}
                        className="rounded-xl h-12 border-gray-100 focus:border-indigo-500"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label={<Text className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Email Address</Text>}>
                  <Input
                    size="large"
                    placeholder="john@example.com"
                    value={state.email}
                    onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl h-12 border-gray-100 focus:border-indigo-500"
                  />
                </Form.Item>

                <Row gutter={24}>
                  <Col span={24} sm={12}>
                    <Form.Item label={<Text className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Degree</Text>}>
                      <Select
                        size="large"
                        placeholder="Select Degree"
                        value={state.degree || undefined}
                        onChange={(val) => setState(prev => ({ ...prev, degree: val }))}
                        className="w-full h-12 rounded-xl overflow-hidden"
                      >
                        <Option value="BSSE">BSSE</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={12}>
                    <Form.Item label={<Text className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Semester</Text>}>
                      <Select
                        size="large"
                        placeholder="Select Semester"
                        value={state.semester || undefined}
                        onChange={(val) => setState(prev => ({ ...prev, semester: val }))}
                        className="w-full h-12 rounded-xl overflow-hidden"
                      >
                        <Option value="4">4th Semester</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={24} sm={12}>
                    <Form.Item label={<Text className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Section</Text>}>
                      <Select
                        size="large"
                        placeholder="Section"
                        value={state.section || undefined}
                        onChange={(val) => setState(prev => ({ ...prev, section: val }))}
                        className="w-full h-12 rounded-xl overflow-hidden"
                      >
                        <Option value="A">A</Option>
                        <Option value="B">B</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={12}>
                    <Form.Item label={<Text className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">AG Number</Text>}>
                      <Input
                        size="large"
                        placeholder="0000-AG-0000"
                        value={state.agNo}
                        onChange={(e) => setState(prev => ({ ...prev, agNo: e.target.value.toUpperCase() }))}
                        className="rounded-xl h-12 border-gray-100 focus:border-indigo-500"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider className="my-6!">
                  <Text className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Security</Text>
                </Divider>

                <Row gutter={24}>
                  <Col span={24} sm={12}>
                    <Form.Item label={<Text className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Password</Text>}>
                      <Input.Password
                        size="large"
                        placeholder="••••••••"
                        value={state.password}
                        onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                        className="rounded-xl h-12 border-gray-100 focus:border-indigo-500"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={12}>
                    <Form.Item label={<Text className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Confirm Password</Text>}>
                      <Input.Password
                        size="large"
                        placeholder="••••••••"
                        value={state.confirmPassword}
                        onChange={(e) => setState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="rounded-xl h-12 border-gray-100 focus:border-indigo-500"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isProcessing}
                  block
                  size="large"
                  className="h-14 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:shadow-indigo-200 border-none transition-all duration-300 transform hover:-translate-y-0.5"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Create My Account
                </Button>
              </Form>

              <div className="text-center mt-10">
                <Text className="text-gray-400">Already part of the network? </Text>
                <Link to="/auth/login" className="text-indigo-600 font-bold hover:text-indigo-700 underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            </div>
          </Card>
       </div>
    </div>
  );
};

export default Register;
