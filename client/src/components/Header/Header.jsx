import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import "./header.scss";

export default function Header() {
  return (
    <div id="client-header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>
        <nav>
          <NavLink to="/">الرئيسية</NavLink>
          <NavLink to="/about">من نحن</NavLink>
          <NavLink to="/gallery">اعمالنا</NavLink>
          <NavLink to="/contact">تواصل معنا</NavLink>
        </nav>
      </div>
    </div>
  );
}
