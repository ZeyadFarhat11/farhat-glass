import { useEffect, useState } from "react";
import GalleryImagesList from "../../../../components/Admin/Gallery/GalleryImagesList";
import "./gallery.scss";
import { adminApi } from "../../../../utils/api";

export default function AdminGallery() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    try {
      const res = await adminApi.get("/gallery");
      if (res.status === 200) {
        setLoading(false);
        setImages(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    loadImages();
  }, []);
  return (
    <main id="admin-gallery">
      <h1 className="text-center py-3">صور المعرض</h1>
      <GalleryImagesList
        images={images}
        loadImages={loadImages}
        loading={loading}
      />
    </main>
  );
}
