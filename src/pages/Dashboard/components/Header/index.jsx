import React from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";

const Header = () => {
  const { handleLogout, user } = useAuthContext();

  return (
    <header className="flex items-center h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 sm:px-8 sticky top-0 z-45">
      {/* Role Indicator */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col">
          <h2 className="text-sm font-semibold text-gray-800 leading-tight">
            {user?.role === "admin" ? "Systems Administrator" : "Student Portal"}
          </h2>
          <span className="text-xs text-gray-500 leading-tight">
             Manage & share university resources
          </span>
        </div>
      </div>

      {/* Logout Button (Right Side) */}
      <div className="ml-auto flex items-center gap-4 sm:gap-6">
        <div className="hidden md:flex flex-col text-right">
           <span className="text-sm font-medium text-gray-800 leading-tight">{user?.firstName} {user?.lastName}</span>
           <span className="text-xs text-indigo-500 font-medium leading-tight tracking-wide">AG-{user?.agNo?.split('-AG-')[1] || "6000"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 text-gray-500 hover:text-red-600 px-3 h-9 rounded-lg transition-colors duration-200 border border-transparent hover:bg-red-50"
        >
          <span className="hidden sm:inline text-sm font-medium">Sign out</span>
          <LogoutOutlined className="text-sm group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </header>
  );
};

export default Header;
