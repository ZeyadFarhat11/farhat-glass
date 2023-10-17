import { Skeleton } from "antd";
import GalleryImage from "./GalleryImage";

export default function GalleryImagesList({ images, loadImages, loading }) {
  if (loading) return <GalleryImagesPlaceholder />;
  if (images.length === 0)
    return <h3 className="text-center text-secondary">لا يوجد صور بالمعرض</h3>;
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
        <div className="image-box image-placeholder" key={i}>
          <Skeleton.Image active />
        </div>
      ))}
    </div>
  );
}
