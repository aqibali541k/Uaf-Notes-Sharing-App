import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Typography,
  Avatar,
} from "antd";
const { Option } = Select;
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
      if (
        !firstName ||
        !email ||
        !degree ||
        !semester ||
        !section ||
        !agNo ||
        !password ||
        !confirmPassword
      ) {
        return message.error("All fields are required");
      }
      if (password !== confirmPassword)
        return message.error("Passwords do not match");
      const agRegex = /^\d{4}-AG-\d{4,5}$/;
      if (!agRegex.test(agNo.toUpperCase())) {
        return message.error("AG No must be in format 0000-AG-0000");
      }

      // ✅ Range check
      const parts = agNo.split("-");
      const year = parseInt(parts[0], 10);
      const number = parseInt(parts[2], 10);
      if (
        !(
          (year === 2024 && number >= 4098) ||
          (year === 2024 && number <= 6013)
        )
      ) {
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

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        formData,
      );

      const { user, token } = res.data;
      handleRegister(user, token);
      message.success("Registered successfully");
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/dashboard");

      setState(initialState);
    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const labelStyle = { color: "#1f2937", fontWeight: 600 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-100 via-green-200 to-green-300 px-4 sm:px-6">
      <div className="w-full max-w-lg p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md border border-green-200">
        {/* Title */}
        <div className="text-center mb-6">
          <Title
            level={2}
            className="text-green-800 font-extrabold text-xl sm:text-2xl md:text-3xl"
          >
            Student Registration
          </Title>
          <p className="text-sm sm:text-base text-green-700">
            Create your account to access student portal
          </p>
        </div>

        {/* Profile icon + clickable */}
        <div className="flex justify-center mb-6">
          <div
            onClick={() => fileInputRef.current.click()}
            className="relative w-24 h-24 sm:w-28 sm:h-28 cursor-pointer flex items-center justify-center bg-green-200 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <UserOutlined className="text-3xl! sm:text-4xl! text-green-800!" />
            <PlusOutlined className="absolute! bottom-1! right-1! bg-green-500! text-white! rounded-full! p-1! text-xs! sm:text-sm!" />
          </div>
          <input
            type="file"
            name="image"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <Form layout="vertical" onFinish={handleSubmit}>
          {/* Name Fields */}
          <Row gutter={16} className="flex flex-col sm:flex-row">
            <Col span={24} sm={12}>
              <Form.Item label={<span style={labelStyle}>First Name</span>}>
                <Input
                  name="firstName"
                  value={state.firstName}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  placeholder="First Name"
                />
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label={<span style={labelStyle}>Last Name</span>}>
                <Input
                  name="lastName"
                  value={state.lastName}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  placeholder="Last Name"
                  className="rounded-xl py-3 px-4 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-400"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Email */}
          <Form.Item label={<span style={labelStyle}>Email</span>}>
            <Input
              name="email"
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email"
              className="rounded-xl py-3 px-4 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-400"
            />
          </Form.Item>

          {/* Degree & Semester */}
          <Row gutter={16} className="flex flex-col sm:flex-row">
            <Col span={24} sm={12}>
              <Form.Item label={<span style={labelStyle}>Degree</span>}>
                <Select
                  value={state.degree}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, degree: value }))
                  }
                  placeholder="Select degree"
                  className="rounded-xl"
                >
                  <Option value="">Select Degree</Option>
                  <Option value="BSSE">BSSE</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label={<span style={labelStyle}>Semester</span>}>
                <Select
                  value={state.semester}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, semester: value }))
                  }
                  placeholder="Select semester"
                  className="rounded-xl"
                >
                  <Option value="">Select Semester</Option>
                  <Option value="4">4th Semester</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Section & AG No */}
          <Row gutter={16} className="flex flex-col sm:flex-row">
            <Col span={24} sm={12}>
              <Form.Item label={<span style={labelStyle}>Section</span>}>
                <Select
                  name="section"
                  value={state.section}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, section: value }))
                  }
                  placeholder="Section (e.g., A, B)"
                  className="rounded-xl py-3 px-4 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-400"
                >
                  <Option value="">Select Section</Option>
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label={<span style={labelStyle}>AG No</span>}>
                <Input
                  name="agNo"
                  value={state.agNo}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, agNo: e.target.value }))
                  }
                  placeholder="0000-AG-0000"
                  className="rounded-xl py-3 px-4 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-400"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Password */}
          <Form.Item label={<span style={labelStyle}>Password</span>}>
            <Input.Password
              name="password"
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Enter your password"
              className="rounded-xl py-3 px-4 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-400"
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Confirm Password</span>}>
            <Input.Password
              name="confirmPassword"
              value={state.confirmPassword}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Confirm password"
              className="rounded-xl py-3 px-4 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-400"
            />
          </Form.Item>

          {/* Submit */}
          <Button
            htmlType="submit"
            loading={isProcessing}
            className="w-full! py-3! rounded-xl! text-white! bg-green-600! hover:bg-green-700! border-none! shadow-lg! transition-all! duration-300! hover:shadow-2xl! mt-2!"
          >
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
