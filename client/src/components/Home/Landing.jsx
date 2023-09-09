import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as LandingDecoration } from "../../assets/images/landing-decoration.svg";
import {
  faPhone,
  faQuoteLeft,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import arrow from "../../assets/images/landing-arrow.svg";
function Landing() {
  return (
    <div className="landing">
      <div className="container">
        {/* <img src={landingDecoration} alt="decoration" className="decoration" /> */}
        <LandingDecoration className="decoration" />
        <h1>فرحات للزجاج والسيكوريت</h1>
        <p>
          <FontAwesomeIcon icon={faQuoteRight} className="right-quote" />
          مع شركة فرحات للزجاج والسيكوريت ستحصل علي اعلي جودة مقابل افضل سعر.
          <FontAwesomeIcon icon={faQuoteLeft} className="left-quote" />
        </p>
        <a href="tel:01008917819" className="phone">
          <span>01008917819</span>
          <FontAwesomeIcon icon={faPhone} />
        </a>
        <a href="#brief">
          <img src={arrow} alt="arrow-down" className="arrow-down" />
        </a>
      </div>
    </div>
  );
}

export default Landing;
