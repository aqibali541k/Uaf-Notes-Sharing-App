import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Navigate, Route, Routes } from "react-router-dom";
import Public from "./Public";
// import { useAuthContext } from "../../context/AuthContext";

const Frontend = () => {
  // const { isAuth } = useAuthContext();
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="grow">
        <Routes>
          <Route path="/" element={<Public />} />
        </Routes>
      </div>

      <Footer />
    </main>
  );
};

export default Frontend;
