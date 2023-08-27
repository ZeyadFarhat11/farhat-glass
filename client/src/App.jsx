import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

import Header from "./components/Header/Header";
import Clients from "./pages/Clients/Clients";
import Invoices from "./pages/Invoices/Invoices";
import Home from "./pages/Home/Home";
import Client from "./pages/Client/Client";

import useGlobalContext from "./context/global.context";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/style.scss";
import Login from "./pages/Login/Login";
import Jobs from "./pages/Jobs/Jobs";
import Invoice from "./pages/Invoice/Invoice";

function App() {
  const { globalLoading } = useGlobalContext();

  return (
    <>
      <ToastContainer autoClose={3000} position="top-left" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client/:clientId" element={<Client />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoice/:invoiceId" element={<Invoice />} />
        <Route path="/jobs" element={<Jobs />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
      <HashLoader loading={globalLoading} id="loading" />
    </>
  );
}

export default App;
