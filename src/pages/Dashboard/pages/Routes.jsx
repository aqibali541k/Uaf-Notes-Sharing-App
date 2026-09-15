import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import CreateNotes from "./CreateNotes";
import Analytics from "./Analytics";
import Header from "../components/Header";
import Shared from "./Shared";
import Private from "./Private";
import AllStudents from "./AllStudents";

const Index = () => {
  return (
    <main className="flex flex-col min-h-screen flex-1">
      <Header />

      <div className="flex-1 overflow-y-auto bg-slate-50">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="new-notes" element={<CreateNotes />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="shared" element={<Shared />} />
          <Route path="private" element={<Private />} />
          <Route path="all-users" element={<AllStudents />} />
          {/* /dashboard and unknown sub-paths land on the analytics overview */}
          <Route path="*" element={<Navigate to="/dashboard/analytics" replace />} />
        </Routes>
      </div>
    </main>
  );
};

export default Index;
