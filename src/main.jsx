import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext.jsx";
import TabProvider from "./context/TabContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TabProvider>
          <App />
        </TabProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
