import dayjs from "dayjs";
import convertToArabicDate from "../../../utils/convertToArabicDate";
import { adminApi } from "../../../utils/api";
import { toast } from "react-toastify";
import { useState } from "react";

const types = {
  shawer: "حمامات شاور",
  frontage: "واجهات سيكوريت",
  structure: "استراكشر",
  mirror: "مرايات",
};

export default function GalleryImage({
  url,
  type,
  loadImages,
  createdAt,
  _id,
}) {
  const [loading, setLoading] = useState(false);

  const deleteImage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await adminApi.delete(`/gallery/${_id}`);
      toast.success("تم حذف الصورة بنجاح");
      loadImages();
    } catch (err) {
      console.log(err);
      toast.error("حدث خطأ اثناء محاولة حذف الصورة");
    }
  };

  const arabicDate = convertToArabicDate(dayjs(createdAt).format("DD-MM-YYYY"));
  return (
    <div className="image-box">
      <img src={url} alt="Gallery Image" />
      <div className="line mt-2">
        <b>النوع: </b>
        <b>{types[type]}</b>
      </div>
      <div className="line">
        <b>تاريخ الاضافة: </b>
        <b>{arabicDate}</b>
      </div>
      <div className="btns">
        <button className="delete" onClick={deleteImage}>
          {loading ? "جار التحميل..." : "حذف"}
        </button>
        <button className="edit">{loading ? "جار التحميل..." : "تعديل"}</button>
      </div>
    </div>
  );
}
