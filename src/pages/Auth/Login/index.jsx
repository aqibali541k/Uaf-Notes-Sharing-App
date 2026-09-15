import { Button, Form, Input, message, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { API_URL } from "../../../constants";
import Seo from "../../../components/Seo";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { Text } = Typography;
const initialstate = { email: "", password: "" };

const Login = () => {
  const { handleLogin } = useAuthContext();
  const [state, setState] = useState(initialstate);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { email, password } = state;
      if (!email || !password) return message.error("All fields are required");
      const res = await axios.post(`${API_URL}/users/login`, state);
      const { token, user } = res.data;
      handleLogin(user, token);
      navigate("/");
      message.success("Welcome back!");
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Seo
        title="Student Login | UAF Notes Sharing App"
        description="Sign in to UAF Notes Sharing App to browse, create and download University of Agriculture Faisalabad course notes shared by your classmates."
        path="/auth/login"
        noindex
      />

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
            aria-hidden="true"
          >
            <LockOutlined className="text-xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student login
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to access your notes portal
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label={
                <span className="text-xs font-medium text-slate-600">
                  Email address
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                name="email"
                type="email"
                autoComplete="email"
                prefix={<MailOutlined className="mr-1 text-slate-400" />}
                value={state.email}
                onChange={handleChange}
                placeholder="name@university.edu"
                className="h-10 rounded-lg border-slate-200"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-xs font-medium text-slate-600">
                  Password
                </span>
              }
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                name="password"
                autoComplete="current-password"
                prefix={<LockOutlined className="mr-1 text-slate-400" />}
                value={state.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="h-10 rounded-lg border-slate-200"
              />
            </Form.Item>

            <div className="-mt-1 mb-4 flex justify-end">
              <Link
                to="/auth/reset-password"
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-10 rounded-lg text-sm font-medium"
            >
              Sign in
            </Button>

            <div className="mt-5 text-center">
              <Text className="text-xs text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  Register
                </Link>
              </Text>
            </div>
          </Form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} UAF Notes Sharing App
        </p>
      </div>
    </div>
  );
};

export default Login;
