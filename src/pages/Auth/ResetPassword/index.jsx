import { Button, Form, Input, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { API_URL } from "../../../constants";
import Seo from "../../../components/Seo";

const initialstate = { email: "" };

const ResetPassword = () => {
  const [state, setState] = useState(initialstate);
  const [loading, setLoading] = useState(false);

  // handle input
  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // when form fails validation
  const handleFailed = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
  };

  // when form is submitted successfully
  const handleSubmit = async () => {
    if (!state.email) return message.error("Email is required");
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/users/reset-password-request`,
        { email: state.email },
      );

      message.success(res.data.message);
      console.log("Reset Link (for dev):", res.data.resetLink); // dev only
      setState(initialstate);
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Seo
        title="Reset Your Password | UAF Notes Sharing App"
        description="Request a password reset link for your UAF Notes Sharing App student account."
        path="/auth/reset-password"
        noindex
      />

      <div className="w-full max-w-md">
        <Link
          to="/auth/login"
          className="mb-6 inline-flex items-center text-xs font-medium text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeftOutlined className="mr-2" />
          Back to login
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="mb-6 text-center">
            <div
              className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
              aria-hidden="true"
            >
              <MailOutlined className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reset password
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter your registered email to receive a reset link
            </p>
          </div>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            onFinishFailed={handleFailed}
            requiredMark={false}
          >
            <Form.Item
              label={
                <span className="text-xs font-medium text-slate-600">
                  Email
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                name="email"
                type="email"
                autoComplete="email"
                value={state.email}
                placeholder="Enter your email"
                className="h-10 rounded-lg border-slate-200"
                onChange={handleChange}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-10 rounded-lg text-sm font-medium"
            >
              Request reset link
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
