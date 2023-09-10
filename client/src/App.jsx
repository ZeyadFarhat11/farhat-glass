import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import DefaultLayout from "./pages";
import Admin from "./pages/Admin";
import Client from "./pages/Admin/Client/Client";
import Clients from "./pages/Admin/Clients/Clients";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Invoice from "./pages/Admin/Invoice/Invoice";
import Invoices from "./pages/Admin/Invoices/Invoices";
import Works from "./pages/Admin/Works/Works";
import Home from "./pages/Home/Home";
import "./assets/style.scss";
import Contact from "./pages/Contact/Contact";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.document.title = "فرحات للزجاج والسيكوريت";
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route element={<Dashboard />} index />
          <Route path="clients" element={<Clients />} />
          <Route path="client/:clientId" element={<Client />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoice/:invoiceId" element={<Invoice />} />
          <Route path="works" element={<Works />} />
        </Route>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
