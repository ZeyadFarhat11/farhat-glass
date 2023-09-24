import { Navigate, Route, Routes } from "react-router-dom";
import { HashLoader } from "react-spinners";
import Header from "../../components/Admin/Header/Header";
import useGlobalContext from "../../context/globalContext";
import Dashboard from "./Dashboard/Dashboard";
import Clients from "./Clients/Clients";
import Client from "./Client/Client";
import Invoices from "./Invoices/Invoices";
import InvoiceDetails from "./InvoiceDetails/InvoiceDetails";
import Works from "./Works/Works";
import Messages from "./Website/Messages/Messages";
import Gallery from "./Website/Gallery/Gallery";
import UploadGalleryImages from "./Website/UploadGalleryImages/UploadGalleryImages";
import Helmet from "react-helmet";

export default function Admin() {
  const { globalLoading } = useGlobalContext();
  const notAdmin = !localStorage.token;

  if (notAdmin) return <Navigate to="/admin/login" />;
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
        <Route path="website/gallery" element={<Gallery />} />
        <Route
          path="website/gallery/upload"
          element={<UploadGalleryImages />}
        />
      </Routes>
    </>
  );
}
