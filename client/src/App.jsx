import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import "./assets/style.scss";
import DefaultLayout from "./pages";
import { Suspense, lazy } from "react";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import FallBackLoading from "./components/FallBackLoading/FallBackLoading";
import Login from "./pages/admin/Login/Login";

const Admin = lazy(() => import("./pages/admin"));

function App() {
  return (
    <>
      <ToastContainer autoClose={3000} position="top-left" />
      <Suspense fallback={<FallBackLoading />}>
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
