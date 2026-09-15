import React from "react";

const ScreenLoader = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <span className="loader" />
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default ScreenLoader;
