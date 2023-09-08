import "./overlay.scss";

export default function Overlay({ onClick = () => null, active }) {
  return (
    <div
      className={`overlay ${active ? "active" : ""}`}
      onClick={onClick}
    ></div>
  );
}
