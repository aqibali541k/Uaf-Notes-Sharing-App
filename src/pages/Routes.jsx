import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Frontend from "./Frontend";
import DashboardPrivate from "../components/PrivateRoute/Dashboard";
import ScreenLoader from "../components/ScreenLoader";

/* The public homepage stays in the main bundle for a fast first paint.
 * Auth and dashboard screens (antd forms, quill editor, recharts) are
 * split into separate files that are only downloaded when needed. */
const Auth = lazy(() => import("./Auth"));
const Dashboard = lazy(() => import("./Dashboard"));

const Index = () => {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Routes>
        <Route path="/*" element={<Frontend />} />
        <Route path="auth/*" element={<Auth />} />
        <Route
          path="dashboard/*"
          element={<DashboardPrivate Component={Dashboard} />}
        />
      </Routes>
    </Suspense>
  );
};

export default Index;
