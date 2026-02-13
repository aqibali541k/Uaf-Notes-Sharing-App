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
import { useAuthContext } from "../../../../context/AuthContext"; // <-- user role ke liye

const Sider = () => {
  const { isSiderOpen, setIsSiderOpen } = useTabContext();
  const { user } = useAuthContext(); // user ka role check karne ke liye
  const location = useLocation();

  // Common menu items
  const menuItems = [
    {
      key: "Analytics",
      label: "Analytics",
      icon: <BarChartOutlined />,
      path: "/dashboard/analytics",
    },
    {
      key: "Profile",
      label: "Profile",
      icon: <UserOutlined />,
      path: "/dashboard/profile",
    },
    {
      key: "New_Notes",
      label: "New Notes",
      icon: <FileAddOutlined />,
      path: "/dashboard/new-notes",
    },
    {
      key: "Shared_Notes",
      label: "Shared Notes",
      icon: <TeamOutlined />,
      path: "/dashboard/shared",
    },
    {
      key: "Private_Notes",
      label: "Private Notes",
      icon: <LockOutlined />,
      path: "/dashboard/private",
    },
  ];

  // Agar admin hai to "All Users" menu item add kar do
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
      className={`fixed! top-0 bottom-0 left-0 z-50 text-white shadow-lg
        bg-linear-to-br! from-blue-600 to-blue-400 transition-all duration-300
        ${isSiderOpen ? "w-60" : "w-16"}`}
    >
      {/* TOP */}
      <div className="flex items-center justify-between p-3 border-b border-white/20">
        {/* TOGGLE */}
        <button
          onClick={() => setIsSiderOpen(!isSiderOpen)}
          className="hidden sm:flex w-10 h-10 items-center justify-center
          bg-white text-black rounded-lg text-lg"
        >
          <MenuOutlined />
        </button>

        {/* HOME ICON (ONLY WHEN OPEN) */}
        {isSiderOpen && (
          <Link
            to="/"
            title="Home"
            className="ml-2 w-10 h-10 flex items-center justify-center
            bg-white text-black rounded-lg text-lg"
          >
            <HomeFilled />
          </Link>
        )}
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-2 mt-4 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`relative group flex items-center gap-3 px-3 py-2 rounded-md transition-all
              ${
                location.pathname === item.path
                  ? "bg-white text-black font-medium"
                  : "hover:bg-blue-500"
              }`}
          >
            <span className="text-lg">{item.icon}</span>

            {isSiderOpen && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}

            {/* TOOLTIP WHEN CLOSED */}
            {!isSiderOpen && (
              <span
                className="absolute left-14 bg-black text-white text-sm px-2 py-1 rounded-md
                opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50"
              >
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* 🔽 BOTTOM ARROW (ONLY WHEN CLOSED) */}
      {!isSiderOpen && (
        <div className="absolute bottom-4 left-0 w-full flex justify-center">
          <Link
            to="/"
            title="Back to Home"
            className="w-10 h-10 flex items-center justify-center
            bg-white text-black rounded-lg shadow-md
            hover:scale-110 transition"
          >
            <HomeOutlined />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sider;
