import { Button, Col, Form, Input, message, Row, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

const { Title } = Typography;
const initialstate = { email: "", password: "" };

const Login = () => {
  const { handleLogin } = useAuthContext();
  const [state, setState] = useState(initialstate);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleFailed = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { email, password } = state;
      if (!email || !password) return message.error("All fields are required");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        state,
      );

      const { token, user } = res.data;
      handleLogin(user, token);
      navigate("/public");
      message.success("User login successful");
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    color: "#1f2937", // dark gray
    fontWeight: "600",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-300 px-4">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md border border-green-200">
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={handleFailed}
        >
          <Row>
            <Col span={24} className="mb-6 text-center">
              <Title level={2} className="text-green-800 font-extrabold">
                Student Login
              </Title>
              <p className="text-sm text-green-700">
                Welcome! Please login to access your dashboard
              </p>
            </Col>
          </Row>

          {/* Email */}
          <Form.Item
            label={<span style={labelStyle}>Email</span>}
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              name="email"
              value={state.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="rounded-xl py-3 px-4 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-400"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={<span style={labelStyle}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              name="password"
              value={state.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="rounded-xl py-3 px-4 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-400"
            />
          </Form.Item>

          {/* Links */}
          <div className="flex justify-between mb-6 text-sm text-green-800">
            <Link
              to="/auth/reset-password"
              className="hover:text-green-600! transition-colors!"
            >
              Forgot Password?
            </Link>
            <Link
              to="/auth/register"
              className="hover:text-green-600! transition-colors!"
            >
              Don't have an account?
            </Link>
          </div>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full! py-3! rounded-xl! text-white! bg-green-600! hover:bg-green-700! border-none! shadow-lg! transition-all! duration-300! hover:shadow-2xl!"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
