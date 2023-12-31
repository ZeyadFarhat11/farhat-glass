import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AppProvider } from "./context/globalContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ConfigProvider direction="rtl">
      <AppProvider>
        <App />
      </AppProvider>
    </ConfigProvider>
  </BrowserRouter>
);
