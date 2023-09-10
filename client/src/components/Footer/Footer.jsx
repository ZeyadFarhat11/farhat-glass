import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gmailIcon from "../../assets/images/gmail-icon.png";
import { email, location } from "../../data.json";
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
          <a
            href="https://web.whatsapp.com/send?phone=201008917819&text=السلام عليكم ورحمة الله وبركاته"
            target="_blank"
            style={{ color: "#075e54" }}
          >
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
        <p dir="ltr">&copy; 2023 Farhat Glass</p>
        <p>
          Built and Managed by{" "}
          <a href="https://zeyad-farhat.onrender.com" target="_blank">
            Zeyad Farhat
          </a>
        </p>
      </div>
    </footer>
  );
}
