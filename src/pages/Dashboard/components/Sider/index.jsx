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
      className={`fixed top-0 bottom-0 left-0 z-50 text-white shadow-2xl
        transition-all duration-300 ease-in-out border-r border-indigo-500/20
        ${isSiderOpen ? "w-64" : "w-20"}`}
      style={{ backgroundColor: '#1a1c2e' }} // Deep slate/indigo for premium look
    >
      {/* BRANDING / TOGGLE */}
      <div className="flex items-center h-20 px-4 border-b border-white/5">
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isSiderOpen ? "opacity-100" : "opacity-0 w-0"}`}>
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
            <HomeFilled className="text-white text-lg" />
          </div>
          <span className="font-black text-lg tracking-tight uppercase whitespace-nowrap">NotesHub</span>
        </div>

        <button
          onClick={() => setIsSiderOpen(!isSiderOpen)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-white/10 ${!isSiderOpen ? "mx-auto" : "ml-auto"}`}
        >
          <MenuOutlined className="text-indigo-400" />
        </button>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-1.5 mt-8 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`relative group flex items-center gap-4 px-3 h-12 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <span className={`text-xl transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                {item.icon}
              </span>

              <span className={`font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${isSiderOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none w-0"}`}>
                {item.label}
              </span>

              {/* TOOLTIP WHEN CLOSED */}
              {!isSiderOpen && (
                <div className="absolute left-16 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg 
                  opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-4 transition-all duration-300 pointer-events-none z-50 shadow-xl border border-white/10">
                  {item.label}
                </div>
              )}
              
              {isActive && (
                <div className="absolute right-0 w-1 h-6 bg-white rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM ACTION */}
       <div className="absolute bottom-8 left-0 w-full px-3">
          <Link
            to="/"
            className={`flex items-center gap-4 px-3 h-12 rounded-xl transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5 group`}
          >
            <HomeOutlined className="text-xl shrink-0 group-hover:scale-110 transition-transform" />
            <span className={`font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${isSiderOpen ? "opacity-100" : "opacity-0 w-0 pointer-events-none"}`}>
              Return Home
            </span>
            {!isSiderOpen && (
              <div className="absolute left-16 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg 
                opacity-0 group-hover:opacity-100 translate-x-4 transition-all duration-300 pointer-events-none z-50 shadow-xl border border-white/10">
                Home
              </div>
            )}
          </Link>
       </div>
    </div>
  );
};

export default Sider;
