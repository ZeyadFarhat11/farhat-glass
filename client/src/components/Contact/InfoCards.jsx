import {
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { email, location } from "../../data.json";

function Card({ icon, title, children, color }) {
  return (
    <div className="info-card">
      <div
        className="icon"
        style={{ backgroundColor: color?.replace(")", ", .1)") }}
      >
        <FontAwesomeIcon icon={icon} style={{ color }} />
      </div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
export default function InfoCards() {
  return (
    <div className="info-cards">
      <h2>إذا كان لديك أي أسئلة ، فلا تتردد في الاتصال بنا</h2>
      <div className="container">
        <Card title={"مواعيد العمل"} icon={faClock} color="rgb(30, 206, 237)">
          <p>من السبت للخميس: 10ص حتي 10م</p>
        </Card>
        <Card
          title={"البريد الألكتروني"}
          icon={faEnvelope}
          color="rgb(56, 175, 83)"
        >
          <p>{email}</p>
        </Card>
        <Card title={"اتصل بنا"} icon={faPhone} color="rgb(53, 87, 236)">
          <p>01008917819</p>
        </Card>
        <Card title={"العنوان"} icon={faLocationDot} color="rgb(251, 85, 85)">
          <p>
            <b>دمياط: </b>
            {location}
          </p>
        </Card>
      </div>
    </div>
  );
}
