import { NavLink } from "react-router-dom";
import "./header.scss";

function Header() {
  return (
    <header id="header">
      <div className="container">
        <NavLink to="/admin/">الرئيسية</NavLink>
        <NavLink to="/admin/invoices">الفواتير</NavLink>
        <NavLink to="/admin/clients">العملاء</NavLink>
        <NavLink to="/admin/works">الاعمال</NavLink>
      </div>
    </header>
  );
}

export default Header;
