import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./footer.scss";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
function Footer() {
  return (
    <div id="footer">
      <div className="container">
        <div className="wrapper">
          <h3 className="main-title">العنوان</h3>
          <p>دمياط - السنانية - الشيخ سديد - خلف viking للسيارات</p>
        </div>
        <div className="wrapper">
          <h3 className="main-title">التليفون</h3>
          <b>0100-891-7819</b>
        </div>
        <div className="wrapper">
          <h3 className="main-title">تواصل معنا</h3>
          <div className="social">
            <a href="https://www.facebook.com/roshdyfarhatdom" target="_blank">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://web.whatsapp.com/send?phone=201008917819&text=السلام عليكم ورحمة الله وبركاته"
              target="_blank"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
