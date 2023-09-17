import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BiTargetLock } from "react-icons/bi";
import { AiOutlineClockCircle, AiOutlineStar } from "react-icons/ai";
import { BsShieldShaded } from "react-icons/bs";
export default function WhyUs() {
  return (
    <section className="why-us">
      <h2>لماذا فرحات خيارك الصحيح؟</h2>
      <div className="container">
        <Box icon={<BiTargetLock />} color="#fb5555">
          الدقة في التنفيذ
        </Box>
        <Box icon={<AiOutlineClockCircle />} color="#1eceed">
          الالتزام بمواعيد التسليم
        </Box>
        <Box icon={<BsShieldShaded />} color="#38af53">
          جودة الخامات والتنفيذ
        </Box>
        <Box icon={<AiOutlineStar />} color="#3557ec">
          الحرص علي رضا العميل
        </Box>
      </div>
    </section>
  );
}

function Box({ icon, children, color }) {
  return (
    <div className="box">
      <div className="icon" style={{ backgroundColor: color + "1a", color }}>
        {icon}
      </div>
      <h3>{children}</h3>
    </div>
  );
}
