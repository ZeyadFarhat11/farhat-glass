import { Skeleton } from "antd";

export default function MessagesList({ loading, messages }) {
  if (loading) return <MessagesPlaceholder />;
  return (
    <div className="container messages">
      {messages.map((message) => (
        <div className="message" key={message._id}>
          <div className="line">
            <span className="label">الاسم: </span>
            <span className="value">{message.name}</span>
          </div>
          <div className="line">
            <span className="label">الهاتف: </span>
            <span className="value">{message.phone}</span>
          </div>
          <div className="line">
            <span className="label">البريد الاكتروني: </span>
            <span className="value">{message.email}</span>
          </div>
          <p className="message-content">{message.message}</p>
        </div>
      ))}
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
