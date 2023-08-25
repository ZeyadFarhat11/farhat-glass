import { Link } from "react-router-dom";
import "./header.scss";

function Header() {
  return (
    <header id="header">
      <div className="container">
        <Link to="/">الرئيسية</Link>
        <Link to="/invoices">الفواتير</Link>
        <Link to="/clients">العملاء</Link>
        <Link to="/jobs">الاعمال</Link>
      </div>
    </header>
  );
}

export default Header;
