import { Button, Input } from "antd";
import img from "../../assets/images/contact-form-img.webp";
import { useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    console.log("test");
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post("/message", { name, email, phone, message });
      toast.success("تم ارسال الرسالة بنجاح.");
    } catch (err) {
      console.log(err);
      toast.error("حدث خطأ! يرجي اعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="contact-form">
      <div className="container">
        <h2 className="main-title">ارسل رسالة</h2>
        <div className="wrapper">
          <div className="image">
            <img src={img} alt="contact" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="control">
              <label htmlFor="name">الاسم</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم"
                required
              />
            </div>
            <div className="control">
              <label htmlFor="phone">رقم الهاتف</label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="رقم الهاتف"
                required
              />
            </div>
            <div className="control">
              <label htmlFor="email">البريد الالكتروني</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الالكتروني"
                required
              />
            </div>
            <div className="control">
              <label htmlFor="message">الرسالة</label>
              <Input.TextArea
                type="text"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="الرسالة"
                required
              />
            </div>
            <Button htmlType="submit" type="primary">
              إرسال
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
