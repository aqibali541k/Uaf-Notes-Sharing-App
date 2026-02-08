import React from "react";
import { Routes, Route } from "react-router-dom";
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

      <div className="flex-1 bg-gray-50 p-4 md:p-6 overflow-y-auto">
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="new-notes" element={<CreateNotes />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="shared" element={<Shared />} />
          <Route path="private" element={<Private />} />
          <Route path="all-users" element={<AllStudents />} />
        </Routes>
      </div>
    </main>
  );
};

export default Index;
