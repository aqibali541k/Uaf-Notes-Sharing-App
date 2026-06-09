import { Button, Col, Form, Input, message, Row, Typography, Card } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { API_URL, COLORS } from "../../../constants";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
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
        `${API_URL}/users/login`,
        state,
      );

      const { token, user } = res.data;
      handleLogin(user, token);
      navigate("/public");
      message.success("Logged in successfully! Welcome back.");
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-600 rounded-b-[40px] shadow-2xl" />
      
      <Card className="w-full max-w-md rounded-3xl shadow-2xl border-none p-4 sm:p-6 z-10 overflow-hidden">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-6 shadow-sm border border-indigo-100">
            <LockOutlined className="text-3xl text-indigo-600" />
          </div>
          <Title level={2} className="font-black! m-0! tracking-tight">
            Student Login
          </Title>
          <Text className="text-gray-400 mt-2 block">Enter your credentials to access your notes</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={handleFailed}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</span>}
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              name="email"
              prefix={<MailOutlined className="text-gray-300 mr-2" />}
              value={state.email}
              onChange={handleChange}
              placeholder="name@university.edu"
              className="rounded-xl py-3 px-4 border-gray-200 focus:border-indigo-500 hover:border-indigo-400"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</span>}
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              name="password"
              prefix={<LockOutlined className="text-gray-300 mr-2" />}
              value={state.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="rounded-xl py-3 px-4 border-gray-200 focus:border-indigo-500 hover:border-indigo-400"
            />
          </Form.Item>

          <div className="flex justify-between items-center text-xs font-semibold">
            <Link
              to="/auth/reset-password"
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="h-14 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 border-none"
            style={{ backgroundColor: COLORS.primary }}
          >
            Sign In to Dashboard
          </Button>

          <div className="text-center mt-8">
            <Text className="text-gray-400">Don't have an account? </Text>
            <Link
              to="/auth/register"
              className="text-indigo-600 font-bold hover:text-indigo-700 underline underline-offset-4"
            >
              Join your peers
            </Link>
          </div>
        </Form>
      </Card>
      
      <div className="fixed bottom-8 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] z-10">
        © 2026 University Notes Sharing System
      </div>
    </div>
  );
};

export default Login;
