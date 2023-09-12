import { Helmet } from "react-helmet";
import ContactForm from "../../components/Contact/ContactForm";
import InfoCards from "../../components/Contact/InfoCards";
import "./contact.scss";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>فرحات للزجاج والسيكوريت | تواصل معنا</title>
      </Helmet>
      <InfoCards />
      <ContactForm />
    </>
  );
}
