import { Skeleton } from "antd";
import GalleryImage from "./GalleryImage";

export default function GalleryImagesList({
  images,
  loadImages,
  loading = true,
}) {
  if (loading) return <GalleryImagesPlaceholder />;
  return (
    <div className="container">
      {images.map((image) => (
        <GalleryImage key={image._id} {...image} loadImages={loadImages} />
      ))}
    </div>
  );
}

function GalleryImagesPlaceholder() {
  const array = Array(8).fill(0);
  return (
    <div className="container">
      {array.map((_, i) => (
        <div className="image placeholder" key={i}>
          <Skeleton />
        </div>
      ))}
    </div>
  );
}
