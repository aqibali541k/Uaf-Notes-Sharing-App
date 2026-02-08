import React from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";

const Header = () => {
  const { handleLogout, user } = useAuthContext();

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-4 py-3 sticky top-0 z-40">
      {/* Title (Always Centered) */}
      <h2 className="absolute left-1/2 transform -translate-x-1/2 text-base sm:text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-800">
        <UserOutlined className="text-blue-600" />
        {user?.role == "admin" ? "Admin Panel" : "Student Panel"}
      </h2>

      {/* Logout Button (Right Side) */}
      <div className="ml-auto">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold 
            hover:bg-white hover:text-red-600 hover:border hover:border-red-600 transition-all duration-200"
        >
          <LogoutOutlined />
        </button>
      </div>
    </header>
  );
};

export default Header;
