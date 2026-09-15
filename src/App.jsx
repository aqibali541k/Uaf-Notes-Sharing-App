import React from "react";
import { ConfigProvider } from "antd";
import "./App.css";
import Index from "./pages/Routes";
import "react-quill-new/dist/quill.snow.css";
import { COLORS } from "./constants";

/* antd components inherit the app's flat brand colour from here, so
 * buttons, inputs, focus rings and pagination all match the theme. */
function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.primary,
          colorLink: COLORS.primary,
          colorInfo: COLORS.primary,
          borderRadius: 8,
          fontFamily: "inherit",
        },
      }}
    >
      <Index />
    </ConfigProvider>
  );
}

export default App;
