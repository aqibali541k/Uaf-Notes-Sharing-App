import React from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";

const Header = () => {
  const { handleLogout, user } = useAuthContext();

  return (
    <header className="flex items-center h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 sticky top-0 z-45">
      {/* Role Indicator */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col">
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest leading-none">
            {user?.role === "admin" ? "Systems Administrator" : "Student Portal"}
          </h2>
          <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
             Manage & share university resources
          </span>
        </div>
      </div>

      {/* Logout Button (Right Side) */}
      <div className="ml-auto flex items-center gap-6">
        <div className="hidden md:flex flex-col text-right">
           <span className="text-sm font-bold text-gray-800">{user?.firstName} {user?.lastName}</span>
           <span className="text-[10px] text-indigo-500 font-black uppercase tracking-tighter">AG-{user?.agNo?.split('-AG-')[1] || "6000"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 px-4 py-2.5 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest border border-gray-100 hover:border-red-100 shadow-sm hover:shadow-red-900/5"
        >
          <span className="hidden sm:inline">Sign Out</span>
          <LogoutOutlined className="text-sm group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </header>
  );
};

export default Header;
