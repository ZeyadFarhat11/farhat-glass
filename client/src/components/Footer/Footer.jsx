import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gmailIcon from "../../assets/images/gmail-icon.png";
import { email, location, whatsapp } from "../../data.json";
import "./footer.scss";

function FooterHeader() {
  return (
    <div className="container">
      <div className="wrapper">
        <h3 className="main-title">العنوان</h3>
        <p>{location}</p>
      </div>
      <div className="wrapper">
        <h3 className="main-title">التليفون</h3>
        <b>0100-891-7819</b>
      </div>
      <div className="wrapper">
        <h3 className="main-title">تواصل معنا</h3>
        <div className="social">
          <a
            href="https://www.facebook.com/roshdyfarhatdom"
            target="_blank"
            style={{ color: "#3b5998" }}
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href={`mailto:${email}`} target="_blank">
            <img
              src={gmailIcon}
              alt="gmail"
              style={{ width: "30px", paddingBottom: "8px" }}
            />
          </a>
          <a href={whatsapp} target="_blank" style={{ color: "#25d366" }}>
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>
      </div>
    </div>
  );
}
export default function Footer() {
  return (
    <footer id="footer">
      <FooterHeader />
      <hr />
      <div className="container">
        <p>جميع الحقوق محفوظة - فرحات للزجاج والسيكوريت - &copy; 2023</p>
        <p>
          تصميم وبرمجة{" "}
          <a href="https://zeyad-farhat.onrender.com" target="_blank">
            زياد فرحات
          </a>
        </p>
      </div>
    </footer>
  );
}
