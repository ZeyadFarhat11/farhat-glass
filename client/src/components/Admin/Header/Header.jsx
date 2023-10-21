import { Link, NavLink, useLocation } from "react-router-dom";
import "./header.scss";
import { useState } from "react";

export default function Header() {
  const [websiteSubmenu, setWebsiteSubmenu] = useState(false);
  const location = useLocation();

  const toggleWebsiteSubmenu = () => {
    setWebsiteSubmenu((p) => !p);
  };

  const websiteButtonActive = location.pathname.startsWith("/admin/website");

  return (
    <header id="header">
      <div className="container">
        <NavLink to="/admin/" className="nav-link">
          الرئيسية
        </NavLink>
        <NavLink to="/admin/invoices" className="nav-link">
          الفواتير
        </NavLink>
        <NavLink to="/admin/clients" className="nav-link">
          العملاء
        </NavLink>
        <button
          className={`submenu-btn${websiteButtonActive ? " active" : ""}`}
          onClick={toggleWebsiteSubmenu}
        >
          الموقع
          <ul className="submenu" data-active={websiteSubmenu}>
            <li>
              <Link to="/">الموقع</Link>
            </li>
            <li>
              <Link to="/admin/website/settings">الاعدادات</Link>
            </li>
            <li>
              <Link to="/admin/website/messages">الرسائل</Link>
            </li>
            <li>
              <Link to="/admin/website/gallery">المعرض</Link>
            </li>
            <li>
              <Link to="/admin/website/gallery/upload">رفع صور للمعرض</Link>
            </li>
          </ul>
        </button>
      </div>
    </header>
  );
}
