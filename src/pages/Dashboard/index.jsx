import React from "react";
import Sider from "./components/Sider";
import Index from "./pages/Routes";
import { useTabContext } from "../../context/TabContext";

const Dashboard = () => {
  const { isSiderOpen } = useTabContext();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sider />

      {/* Right Content (Header + Routes) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          ${isSiderOpen ? "ml-60" : "ml-16"}`}
      >
        <Index />
      </div>
    </div>
  );
};

export default Dashboard;
