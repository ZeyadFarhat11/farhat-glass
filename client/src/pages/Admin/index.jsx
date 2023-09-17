import { Navigate, Route, Routes } from "react-router-dom";
import { HashLoader } from "react-spinners";
import Header from "../../components/Admin/Header/Header.jsx";
import useGlobalContext from "../../context/globalContext.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import Clients from "./Clients/Clients.jsx";
import Client from "./Client/Client.jsx";
import Invoices from "./Invoices/Invoices.jsx";
import InvoiceDetails from "./InvoiceDetails/InvoiceDetails.jsx";
import Works from "./Works/Works.jsx";
import Messages from "./Website/Messages/Messages";
import Helmet from "react-helmet";
export const isAdmin = () => !!localStorage.token;

export default function Admin() {
  const { globalLoading } = useGlobalContext();

  if (!isAdmin()) return <Navigate to="/admin/login" />;
  return (
    <>
      <Helmet>
        <title>فرحات للزجاج والسيكوريت | ادمن</title>
      </Helmet>
      <Header />
      <HashLoader loading={globalLoading} id="loading" />
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="client/:clientId" element={<Client />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="invoice/:invoiceId" element={<InvoiceDetails />} />
        <Route path="works" element={<Works />} />
        <Route path="website/messages" element={<Messages />} />
      </Routes>
    </>
  );
}
