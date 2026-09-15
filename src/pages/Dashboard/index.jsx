import React from "react";
import Sider from "./components/Sider";
import Index from "./pages/Routes";
import { useTabContext } from "../../context/TabContext";
import Seo from "../../components/Seo";

const Dashboard = () => {
  const { isSiderOpen } = useTabContext();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Seo
        title="Dashboard | UAF Notes Sharing App"
        description="Private dashboard for UAF Notes Sharing App students to create, organise and share University of Agriculture Faisalabad course notes."
        path="/dashboard"
        noindex
      />

      {/* Sidebar */}
      <Sider />

      {/* Right Content (Header + Routes) */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isSiderOpen ? "ml-60" : "ml-16"
        }`}
      >
        <Index />
      </div>
    </div>
  );
};

export default Dashboard;
