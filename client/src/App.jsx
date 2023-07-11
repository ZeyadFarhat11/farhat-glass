import { Routes, Route } from "react-router-dom";
import Clients from "./pages/Clients/Clients";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header/Header";
import Invoices from "./pages/Invoices/Invoices";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/style.scss";
import Home from "./pages/Home/Home";
function App() {
  return (
    <>
      <ToastContainer autoClose={3000} position="top-left" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/invoices" element={<Invoices />} />
      </Routes>
    </>
  );
}

export default App;
