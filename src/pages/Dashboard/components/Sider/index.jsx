import React from "react";
import {
  BarChartOutlined,
  FileAddOutlined,
  HomeFilled,
  HomeOutlined,
  LockOutlined,
  MenuOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useTabContext } from "../../../../context/TabContext";
import { useAuthContext } from "../../../../context/AuthContext";

const Sider = () => {
  const { isSiderOpen, setIsSiderOpen } = useTabContext();
  const { user } = useAuthContext();
  const location = useLocation();

  const menuItems = [
    { key: "Analytics", label: "Analytics", icon: <BarChartOutlined />, path: "/dashboard/analytics" },
    { key: "Profile", label: "Profile", icon: <UserOutlined />, path: "/dashboard/profile" },
    { key: "New_Notes", label: "New Notes", icon: <FileAddOutlined />, path: "/dashboard/new-notes" },
    { key: "Shared_Notes", label: "Shared Notes", icon: <TeamOutlined />, path: "/dashboard/shared" },
    { key: "Private_Notes", label: "Private Notes", icon: <LockOutlined />, path: "/dashboard/private" },
  ];

  if (user?.role === "admin") {
    menuItems.push({
      key: "All_Users",
      label: "All Users",
      icon: <TeamOutlined />,
      path: "/dashboard/all-users",
    });
  }

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 z-50 text-white border-r border-white/10
        transition-all duration-300 ease-in-out
        ${isSiderOpen ? "w-60" : "w-16"}`}
      style={{ backgroundColor: "#1a1c2e" }}
    >
      {/* Branding / Toggle */}
      <div className="flex items-center h-14 px-3 border-b border-white/5">
        <div
          className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 ${
            isSiderOpen ? "opacity-100 flex-1" : "opacity-0 w-0"
          }`}
        >
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center shrink-0">
            <HomeFilled className="text-white text-sm" />
          </div>
          <span className="font-semibold text-sm tracking-wide whitespace-nowrap">NotesHub</span>
        </div>

        <button
          onClick={() => setIsSiderOpen(!isSiderOpen)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors ${
            !isSiderOpen ? "mx-auto" : "ml-auto"
          }`}
          aria-label="Toggle sidebar"
        >
          <MenuOutlined className="text-gray-400 text-sm" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-0.5 mt-4 px-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`group relative flex items-center gap-3 px-2.5 h-10 rounded-lg transition-colors duration-150 ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>

              <span
                className={`text-sm font-medium tracking-normal whitespace-nowrap transition-all duration-300 ${
                  isSiderOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none w-0"
                }`}
              >
                {item.label}
              </span>

              {/* Tooltip when collapsed */}
              {!isSiderOpen && (
                <div className="absolute left-14 bg-gray-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md
                  opacity-0 group-hover:opacity-100 pointer-events-none z-50 border border-white/10 whitespace-nowrap
                  translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                  {item.label}
                </div>
              )}

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 w-0.5 h-5 bg-white/60 rounded-l" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Return Home */}
      <div className="absolute bottom-6 left-0 w-full px-2">
        <Link
          to="/"
          className="group relative flex items-center gap-3 px-2.5 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <HomeOutlined className="text-base shrink-0" />
          <span
            className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              isSiderOpen ? "opacity-100" : "opacity-0 w-0 pointer-events-none"
            }`}
          >
            Return Home
          </span>
          {!isSiderOpen && (
            <div className="absolute left-14 bg-gray-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md
              opacity-0 group-hover:opacity-100 pointer-events-none z-50 border border-white/10
              translate-x-1 group-hover:translate-x-0 transition-all duration-200">
              Home
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sider;
