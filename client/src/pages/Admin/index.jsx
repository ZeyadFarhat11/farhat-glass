import { Outlet } from "react-router-dom";
import { HashLoader } from "react-spinners";
import Header from "../../components/Admin/Header/Header.jsx";
import useGlobalContext from "../../context/globalContext.jsx";

function Admin() {
  const { globalLoading } = useGlobalContext();
  return (
    <>
      <Header />
      <HashLoader loading={globalLoading} id="loading" />
      <Outlet />
    </>
  );
}

export default Admin;
