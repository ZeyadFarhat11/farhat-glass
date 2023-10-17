import { useEffect, useState } from "react";
import { Gallery as GalleryGrid } from "react-grid-gallery";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import "./gallery.scss";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const typesLinks = [
  { text: "الكل", type: "all" },
  { text: "واجهات سيكوريت", type: "frontage" },
  { text: "حمامات شاور", type: "shawer" },
  { text: "مرايات", type: "mirror" },
  { text: "استراكشر", type: "structure" },
];

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [photos, setPhotos] = useState([]);
  const [photosType, setPhotosType] = useState(
    searchParams.get("type") || "all"
  );

  console.log(searchParams);

  const loadPhotos = async () => {
    try {
      const res = await api.get(`/gallery?type=${photosType}`);
      console.log(res);
      setPhotos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [photosType]);

  const changePhotosType = (newType) => {
    if (newType === photosType) return;
    setPhotosType(newType);
    searchParams.set("type", newType);
    setSearchParams(searchParams, {});
  };

  return (
    <main id="gallery">
      <h2 className="main-title mx-auto my-4">المعرض</h2>
      <nav className="change-type">
        {typesLinks.map(({ type, text }) => (
          <button
            key={type}
            data-active={photosType === type}
            onClick={() => changePhotosType(type)}
          >
            {text}
          </button>
        ))}
      </nav>
      <div className="container my-5">
        <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 900: 3, 1200: 4 }}>
          <Masonry gutter="15px">
            {photos.map(({ url, _id, type }) => (
              <img
                key={_id}
                src={url}
                style={{ width: "100%", display: "block", borderRadius: "5px" }}
                alt={type}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </main>
  );
}
