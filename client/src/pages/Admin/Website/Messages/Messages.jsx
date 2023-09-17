import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MessagesList from "../../../../components/Website/MessagesList";
import { adminApi } from "../../../../utils/api";
import "./messages.scss";

export default function Messages() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState();
  const loadMessages = async () => {
    try {
      const res = await adminApi.get("/messages");
      await new Promise((res) => setTimeout(res, 3000));
      setLoading(false);
      setMessages(res.data);
    } catch (e) {
      toast.error("تم تسجيل خطأ في الكونسول");
      console.log(e);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);
  return (
    <main id="website-messages">
      <h1>رسائل العملاء</h1>
      <MessagesList messages={messages} loading={loading} />
    </main>
  );
}
