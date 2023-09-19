import { Button, Skeleton } from "antd";
import { toast } from "react-toastify";
import { adminApi } from "../../utils/api";
import dayjs from "dayjs";

export default function MessagesList({ loading, messages, loadMessages }) {
  if (loading) return <MessagesPlaceholder />;
  return (
    <div className="container messages">
      {messages.map((message) => (
        <Message key={message._id} {...message} loadMessages={loadMessages} />
      ))}
    </div>
  );
}

function Message({
  _id,
  name,
  phone,
  email,
  message,
  createdAt,
  loadMessages,
}) {
  const deleteMessage = async () => {
    try {
      const confirmation = window.prompt("رمز الأمان");
      if (!confirmation) return;

      const res = await adminApi.delete(`/message/${_id}`, {
        headers: { confirmation },
      });
      if (res.status === 204) {
        toast.success("تم مسح الرسالة بنجاح");
        loadMessages();
      }
    } catch (err) {
      toast.error("تم تسجيل الخطأ في الكونسول");
      console.log(err);
    }
  };

  const sendDate = dayjs(createdAt).format("YYYY-MM-DD hh:mm:ss");
  return (
    <div className="message">
      <div className="line">
        <span className="label">الاسم: </span>
        <span className="value">{name}</span>
      </div>
      <div className="line">
        <span className="label">الهاتف: </span>
        <span className="value">{phone}</span>
      </div>
      <div className="line">
        <span className="label">البريد الاكتروني: </span>
        <span className="value">{email}</span>
      </div>
      <div className="line">
        <span className="label">تاريخ الارسال: </span>
        <span className="value">{sendDate}</span>
      </div>
      <p className="message-content">{message}</p>
      <Button type="primary" onClick={deleteMessage} className="delete-message">
        ازالة
      </Button>
    </div>
  );
}

function MessagesPlaceholder() {
  const array = Array(8).fill(0);
  return (
    <div className="container messages">
      {array.map((el, i) => (
        <div className="message">
          <Skeleton active key={i} />
        </div>
      ))}
    </div>
  );
}
