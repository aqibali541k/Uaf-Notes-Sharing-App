import { Button, Col, Form, Input, message, Row, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";

const { Title } = Typography;

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
        `${import.meta.env.VITE_API_URL}/users/reset-password-request`,
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

  const labelStyle = { color: "#1f2937", fontWeight: 600 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-300 px-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md border border-green-200">
        <div className="text-center mb-6">
          <Title level={2} className="text-green-800 font-extrabold">
            Reset Password
          </Title>
          <p className="text-sm text-green-700">
            Enter your registered email to receive a reset link
          </p>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={handleFailed}
        >
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
              placeholder="Enter your email"
              className="rounded-xl py-3 px-4 border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-400"
              onChange={handleChange}
            />
          </Form.Item>

          <Button
            htmlType="submit"
            loading={loading}
            className="w-full! py-3! rounded-xl! text-white! bg-green-600! hover:bg-green-700! border-none! shadow-lg! transition-all! duration-300! hover:shadow-2xl!"
          >
            Request Reset Link
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
