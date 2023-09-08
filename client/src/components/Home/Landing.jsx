import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import landingDecoration from "../../assets/images/landing-decoration.svg";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
function Landing() {
  return (
    <div className="landing">
      <div className="container">
        <img src={landingDecoration} alt="decoration" className="decoration" />
        <h1>فرحات للزجاج والسيكوريت</h1>
        <p>
          <FontAwesomeIcon icon={faQuoteRight} className="right-quote" />
          مع شركة فرحات للزجاج والسيكوريت ستحصل علي اعلي جودة مقابل افضل سعر.
          <FontAwesomeIcon icon={faQuoteLeft} className="left-quote" />
        </p>
      </div>
    </div>
  );
}

export default Landing;
