import { Skeleton } from "antd";
import Message from "./Message";

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
