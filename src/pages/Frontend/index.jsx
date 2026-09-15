import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import { Route, Routes } from "react-router-dom";
import Public from "./Public";
import About from "./About";
import FAQ from "./FAQ";
import NotFound from "./NotFound";

const Frontend = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />

      <main className="grow">
        <Routes>
          <Route path="/" element={<Public />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          {/* Any other public URL gets a real 404 page instead of a blank screen */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default Frontend;
