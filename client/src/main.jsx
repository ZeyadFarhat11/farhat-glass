import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { GlobalContextProvider } from "./context/global.context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ConfigProvider direction="rtl">
      <GlobalContextProvider>
        <App />
      </GlobalContextProvider>
    </ConfigProvider>
  </BrowserRouter>
);
