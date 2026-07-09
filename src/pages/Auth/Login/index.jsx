import { Button, Form, Input, message, Typography, Card } from "antd";
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

  const handleChange = (e) => setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { email, password } = state;
      if (!email || !password) return message.error("All fields are required");
      const res = await axios.post(`${API_URL}/users/login`, state);
      const { token, user } = res.data;
      handleLogin(user, token);
      navigate("/public");
      message.success("Welcome back!");
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl mb-5">
            <LockOutlined className="text-xl text-indigo-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Student Login</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to access your notes portal</p>
        </div>

        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              label={<span className="text-xs font-medium text-gray-600">Email address</span>}
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                name="email"
                prefix={<MailOutlined className="text-gray-400 mr-1" />}
                value={state.email}
                onChange={handleChange}
                placeholder="name@university.edu"
                className="rounded-lg h-9 border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-medium text-gray-600">Password</span>}
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                name="password"
                prefix={<LockOutlined className="text-gray-400 mr-1" />}
                value={state.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="rounded-lg h-9 border-gray-200 hover:border-indigo-400 focus:border-indigo-500"
              />
            </Form.Item>

            <div className="flex justify-end -mt-2 mb-4">
              <Link
                to="/auth/reset-password"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-9 rounded-lg text-sm font-medium border-none"
              style={{ backgroundColor: COLORS.primary }}
            >
              Sign In
            </Button>

            <div className="text-center mt-5">
              <Text className="text-xs text-gray-500">
                Don't have an account?{" "}
                <Link to="/auth/register" className="text-indigo-600 font-medium hover:text-indigo-700">
                  Register
                </Link>
              </Text>
            </div>
          </Form>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 University Notes Sharing System
        </p>
      </div>
    </div>
  );
};

export default Login;
