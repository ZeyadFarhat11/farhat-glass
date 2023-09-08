import Header from "../../components/Admin/Header/Header.jsx";
import { Outlet } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import useGlobalContext from "../../context/globalContext.jsx";

function Admin() {
  const { globalLoading } = useGlobalContext();
  return (
    <>
      <ToastContainer autoClose={3000} position="top-left" />
      <Header />
      <HashLoader loading={globalLoading} id="loading" />
      <Outlet />
    </>
  );
}

export default Admin;
