import { NavLink } from "react-router-dom";
import "./header.scss";

function Header() {
  return (
    <header id="header">
      <div className="container">
        <NavLink to="/">الرئيسية</NavLink>
        <NavLink to="/invoices">الفواتير</NavLink>
        <NavLink to="/clients">العملاء</NavLink>
        <NavLink to="/works">الاعمال</NavLink>
      </div>
    </header>
  );
}

export default Header;
