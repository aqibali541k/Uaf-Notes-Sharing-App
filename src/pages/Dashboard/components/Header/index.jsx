import React from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../../context/AuthContext";

const Header = () => {
  const { handleLogout, user } = useAuthContext();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white px-5 sm:px-6">
      {/* Page context */}
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-sm font-semibold text-slate-800">
          {user?.role === "admin" ? "Administrator" : "Student Portal"}
        </h1>
        <span className="truncate text-xs text-slate-500">
          Manage and share university resources
        </span>
      </div>

      {/* User + logout */}
      <div className="ml-auto flex items-center gap-3 sm:gap-5">
        <div className="hidden flex-col text-right md:flex">
          <span className="text-sm font-medium leading-tight text-slate-800">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-xs font-medium leading-tight text-slate-500">
            AG-{user?.agNo?.split("-AG-")[1] || "6000"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <span className="hidden sm:inline">Sign out</span>
          <LogoutOutlined className="text-sm" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Header;
