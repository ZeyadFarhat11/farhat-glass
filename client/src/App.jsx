import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import "./assets/style.scss";
import DefaultLayout from "./pages";
import Admin from "./pages/Admin";
import Client from "./pages/Admin/Client/Client";
import Clients from "./pages/Admin/Clients/Clients";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import InvoiceDetails from "./pages/Admin/InvoiceDetails/InvoiceDetails";
import Invoices from "./pages/Admin/Invoices/Invoices";
import Works from "./pages/Admin/Works/Works";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";

function App() {
  return (
    <>
      <ToastContainer autoClose={3000} position="top-left" />
      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route element={<Dashboard />} index />
          <Route path="clients" element={<Clients />} />
          <Route path="client/:clientId" element={<Client />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoice/:invoiceId" element={<InvoiceDetails />} />
          <Route path="works" element={<Works />} />
        </Route>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
