import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./floating-button.scss";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

function FloatingButton() {
  return (
    <a
      href="https://web.whatsapp.com/send?phone=201008917819&text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D9%88%D8%B1%D8%AD%D9%85%D8%A9%20%D8%A7%D9%84%D9%84%D9%87%20%D9%88%D8%A8%D8%B1%D9%83%D8%A7%D8%AA%D9%87"
      className="floating-button"
      target="_blank"
    >
      <FontAwesomeIcon icon={faWhatsapp} />
    </a>
  );
}

export default FloatingButton;
