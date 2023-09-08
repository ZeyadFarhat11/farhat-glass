import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import "./header.scss";

export default function Header() {
  return (
    <div id="client-header">
      <div className="container">
        <nav>
          <NavLink to="/">الرئيسية</NavLink>
          <NavLink to="/about-us">من نحن</NavLink>
          <NavLink to="/our-work">اعمالنا</NavLink>
          <NavLink to="/contact">تواصل معنا</NavLink>
        </nav>
        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>
      </div>
    </div>
  );
}
