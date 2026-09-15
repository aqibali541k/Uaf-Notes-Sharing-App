import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
} from "antd";
const { Option } = Select;
import React, { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import {
  UserOutlined,
  CameraOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../constants";
import Seo from "../../../components/Seo";

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

const labelClass = "text-xs font-medium text-slate-600";
const fieldClass = "h-10 rounded-lg border-slate-200";

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

  const openFilePicker = () => fileInputRef.current?.click();

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

      navigate("/dashboard");
    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <Seo
        title="Create a Student Account | UAF Notes Sharing App"
        description="Register with your UAF AG number to join UAF Notes Sharing App and start organising and sharing University of Agriculture Faisalabad course notes."
        path="/auth/register"
        noindex
      />

      <div className="mx-auto w-full max-w-2xl px-4">
        <Link
          to="/auth/login"
          className="inline-flex items-center text-xs font-medium text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeftOutlined className="mr-2" />
          Back to login
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 sm:p-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create your student account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Add your details and AG number to start sharing notes with your
              class
            </p>

            {/* Profile image picker */}
            <div className="mt-8 flex justify-center">
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload a profile picture"
                className="group relative cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                onClick={openFilePicker}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openFilePicker();
                  }
                }}
              >
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                  {state.image ? (
                    <img
                      src={URL.createObjectURL(state.image)}
                      alt="Profile picture preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserOutlined className="text-3xl text-slate-300" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white">
                  <CameraOutlined className="text-xs" aria-hidden="true" />
                </div>
                <input
                  id="profile-image"
                  type="file"
                  name="image"
                  accept="image/*"
                  aria-label="Profile picture file"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <Divider className="my-8" />

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Row gutter={20}>
              <Col span={24} sm={12}>
                <Form.Item
                  htmlFor="firstName"
                  label={<span className={labelClass}>First name</span>}
                >
                  <Input
                    id="firstName"
                    size="large"
                    placeholder="John"
                    value={state.firstName}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className={fieldClass}
                  />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  htmlFor="lastName"
                  label={<span className={labelClass}>Last name</span>}
                >
                  <Input
                    id="lastName"
                    size="large"
                    placeholder="Doe"
                    value={state.lastName}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className={fieldClass}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              htmlFor="email"
              label={<span className={labelClass}>Email address</span>}
            >
              <Input
                id="email"
                size="large"
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                value={state.email}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, email: e.target.value }))
                }
                className={fieldClass}
              />
            </Form.Item>

            <Row gutter={20}>
              <Col span={24} sm={12}>
                <Form.Item
                  htmlFor="degree"
                  label={<span className={labelClass}>Degree</span>}
                >
                  <Select
                    id="degree"
                    size="large"
                    placeholder="Select degree"
                    value={state.degree || undefined}
                    onChange={(val) => setState((prev) => ({ ...prev, degree: val }))}
                    className="w-full"
                  >
                    <Option value="BSSE">BSSE</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  htmlFor="semester"
                  label={<span className={labelClass}>Semester</span>}
                >
                  <Select
                    id="semester"
                    size="large"
                    placeholder="Select semester"
                    value={state.semester || undefined}
                    onChange={(val) => setState((prev) => ({ ...prev, semester: val }))}
                    className="w-full"
                  >
                    <Option value="4">4th Semester</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={24} sm={12}>
                <Form.Item
                  htmlFor="section"
                  label={<span className={labelClass}>Section</span>}
                >
                  <Select
                    id="section"
                    size="large"
                    placeholder="Section"
                    value={state.section || undefined}
                    onChange={(val) => setState((prev) => ({ ...prev, section: val }))}
                    className="w-full"
                  >
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  htmlFor="agNo"
                  label={<span className={labelClass}>AG number</span>}
                >
                  <Input
                    id="agNo"
                    size="large"
                    placeholder="0000-AG-0000"
                    value={state.agNo}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        agNo: e.target.value.toUpperCase(),
                      }))
                    }
                    className={fieldClass}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider plain>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Security
              </span>
            </Divider>

            <Row gutter={20}>
              <Col span={24} sm={12}>
                <Form.Item
                  htmlFor="password"
                  label={<span className={labelClass}>Password</span>}
                >
                  <Input.Password
                    id="password"
                    size="large"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={state.password}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className={fieldClass}
                  />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  htmlFor="confirmPassword"
                  label={<span className={labelClass}>Confirm password</span>}
                >
                  <Input.Password
                    id="confirmPassword"
                    size="large"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={state.confirmPassword}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className={fieldClass}
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
              className="mt-2 h-11 rounded-lg text-sm font-semibold"
            >
              Create my account
            </Button>
          </Form>

          <div className="mt-8 text-center">
            <span className="text-sm text-slate-500">
              Already part of the network?{" "}
            </span>
            <Link
              to="/auth/login"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
