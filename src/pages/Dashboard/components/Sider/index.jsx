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
  const { pathname } = useLocation();

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
    <aside
      aria-label="Dashboard sidebar"
      className={`fixed bottom-0 left-0 top-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
        isSiderOpen ? "w-60" : "w-16"
      }`}
    >
      {/* Branding / Toggle */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-3">
        <div
          className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 ${
            isSiderOpen ? "flex-1 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <HomeFilled className="text-sm" aria-hidden="true" />
          </div>
          <span className="whitespace-nowrap text-sm font-semibold text-slate-800">
            UAF Notes
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsSiderOpen(!isSiderOpen)}
          aria-label={isSiderOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isSiderOpen}
          className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 ${
            !isSiderOpen ? "mx-auto" : "ml-auto"
          }`}
        >
          <MenuOutlined className="text-sm" aria-hidden="true" />
        </button>
      </div>

      {/* Menu */}
      <nav aria-label="Dashboard" className="mt-4 flex flex-col gap-1 px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.key}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex h-10 items-center gap-3 rounded-lg px-2.5 transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span
                className={`shrink-0 text-base ${
                  isActive ? "text-brand-600" : ""
                }`}
                aria-hidden="true"
              >
                {item.icon}
              </span>

              <span
                className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                  isSiderOpen
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none w-0 -translate-x-2 opacity-0"
                }`}
              >
                {item.label}
              </span>

              {/* Tooltip when collapsed */}
              {!isSiderOpen && (
                <span className="pointer-events-none absolute left-14 z-50 translate-x-1 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Return Home */}
      <div className="mt-auto border-t border-slate-100 p-2">
        <Link
          to="/"
          className="group relative flex h-10 items-center gap-3 rounded-lg px-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <HomeOutlined className="shrink-0 text-base" aria-hidden="true" />
          <span
            className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
              isSiderOpen ? "opacity-100" : "pointer-events-none w-0 opacity-0"
            }`}
          >
            Return Home
          </span>
          {!isSiderOpen && (
            <span className="pointer-events-none absolute left-14 z-50 translate-x-1 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              Home
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default Sider;
