import { Helmet } from "react-helmet";
import "./about.scss";
import Brief from "../../components/About/Brief";
import WhyUs from "../../components/About/WhyUs";

function About() {
  return (
    <>
      <Helmet>
        <title>فرحات للزجاج والسيكوريت | من نحن</title>
      </Helmet>
      <Brief />
      <WhyUs />
    </>
  );
}

export default About;
