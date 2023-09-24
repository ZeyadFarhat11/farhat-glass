export default function GalleryImage({ url, type, hidden, loadImages }) {
  return (
    <div className="image">
      <div className="img">
        <img src={url} alt="Gallery Image" />
      </div>
      <div className="line">
        <b>النوع: </b>
        <span>{type}</span>
      </div>
    </div>
  );
}
