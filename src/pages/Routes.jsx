import React from "react";
import { Route, Routes } from "react-router-dom";
import Frontend from "./Frontend";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import DashboardPrivate from "../components/PrivateRoute/Dashboard";

const Index = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Frontend />} />
        <Route path="auth/*" element={<Auth />} />
        <Route
          path="dashboard/*"
          element={<DashboardPrivate Component={Dashboard} />}
        />
      </Routes>
    </>
  );
};

export default Index;
