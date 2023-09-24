import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./floating-button.scss";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { whatsapp } from "../../data.json";

function FloatingButton() {
  return (
    <a href={whatsapp} className="floating-button" target="_blank">
      <FontAwesomeIcon icon={faWhatsapp} />
    </a>
  );
}

export default FloatingButton;
