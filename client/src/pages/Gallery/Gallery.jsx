import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import "./gallery.scss";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "rc-image";
import "rc-image/assets/index.css";
import { ScaleLoader } from "react-spinners";

const typesLinks = [
  { text: "الكل", type: "all" },
  { text: "واجهات سيكوريت", type: "frontage" },
  { text: "حمامات شاور", type: "shawer" },
  { text: "مرايات", type: "mirror" },
  { text: "استراكشر", type: "structure" },
];

export default function Gallery() {
  const {
    photos,
    setPhotos,
    loading,
    setLoading,
    changePhotosType,
    photosType,
  } = usePhotos();

  useLoadPhotosOnScroll({ loading, photos, setLoading, setPhotos, photosType });

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
            {photos.map(({ url, _id, type }, i) => (
              <Image
                key={_id}
                src={url}
                alt={type}
                style={{
                  width: "100%",
                  display: "block",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                preview={{
                  toolbarRender: () => null,
                }}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>

        <ScaleLoader
          style={{
            display: "block",
            width: "fit-content",
            margin: "50px auto 0px",
          }}
          loading={loading}
          aria-label="Loading Spinner"
        />
      </div>
    </main>
  );
}

function usePhotos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [photosType, setPhotosType] = useState(
    searchParams.get("type") || "all"
  );
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(photos);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/gallery?type=${photosType}&limit=12`);
      setPhotos(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const changePhotosType = (newType) => {
    if (newType === photosType) return;
    setPhotosType(newType);
    searchParams.set("type", newType);
    setSearchParams(searchParams, {});
  };

  useEffect(() => {
    loadPhotos();
  }, [photosType]);

  return {
    photos,
    setPhotos,
    loading,
    setLoading,
    loadPhotos,
    changePhotosType,
    photosType,
    setPhotosType,
  };
}

function useLoadPhotosOnScroll({
  loading,
  photos,
  setPhotos,
  setLoading,
  photosType,
}) {
  let loadingRef = useRef(loading);
  if (loading !== loadingRef.current) {
    loadingRef.current = loading;
  }

  let photosRef = useRef(photos);
  if (photos !== photosRef.current) {
    photosRef.current = photos;
  }

  let photosFinishedRef = useRef(false);

  const loadMorePhotos = async () => {
    if (loadingRef.current || photosFinishedRef.current) return;
    console.log("Loading More Photos.");
    try {
      let photos = photosRef.current;
      setLoading(true);
      const res = await api.get(
        `/gallery?type=${photosType}&limit=6&skip=${photos.length}`
      );
      if (res.data.length === 0) {
        photosFinishedRef.current = true;
      } else {
        setPhotos([...photos, ...res.data]);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const listener = () => {
      let lastImage = document.querySelector(".rc-image:last-child");
      let loading = loadingRef.current;
      if (
        lastImage &&
        !loading &&
        scrollY + innerHeight >= lastImage.offsetTop + lastImage.clientHeight
      ) {
        loadMorePhotos();
      }
    };
    window.addEventListener("scroll", listener);

    return () => window.removeEventListener("scroll", listener);
  }, []);
}
