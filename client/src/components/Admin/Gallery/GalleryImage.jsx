import dayjs from "dayjs";
import convertToArabicDate from "../../../utils/convertToArabicDate";
import { adminApi } from "../../../utils/api";
import { toast } from "react-toastify";
import { useState } from "react";
import Select from "react-select";
import { types } from "../../../pages/Admin/Website/UploadGalleryImages/UploadGalleryImages";

export default function GalleryImage({
  url,
  type,
  loadImages,
  createdAt,
  _id,
}) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedType, setSelectedType] = useState();

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

  const enableEditMode = () => {
    setEditing(true);
    setSelectedType(types.find((t) => t.value === type));
  };
  const disableEditMode = () => {
    setEditing(false);
  };

  const submitEdit = async () => {
    try {
      await adminApi.patch(`/gallery/${_id}`, { type: selectedType.value });
      loadImages();
      disableEditMode();
    } catch (err) {
      console.log(err);
      toast.error("حدث خطأ اثناء محاولة تعديل نوع الصورة");
    }
  };

  const arabicDate = convertToArabicDate(dayjs(createdAt).format("DD-MM-YYYY"));
  return (
    <div className="image-box">
      <img src={url} alt="Gallery Image" />
      {editing ? (
        <div className="line mt-2 d-flex align-items-center gap-2">
          <b>النوع: </b>
          <Select
            options={types}
            className="flex-grow-1"
            value={selectedType}
            onChange={(val) => setSelectedType(val)}
          />
        </div>
      ) : (
        <div className="line mt-2">
          <b>النوع: </b>
          <b>{types.find((t) => t.value === type)?.label}</b>
        </div>
      )}
      <div className="line">
        <b>تاريخ الاضافة: </b>
        <b>{arabicDate}</b>
      </div>
      <div className="btns">
        {editing ? (
          <>
            <button className="submit" onClick={submitEdit}>
              حفظ
            </button>
            <button className="cancel" onClick={disableEditMode}>
              الغاء
            </button>
          </>
        ) : (
          <>
            <button className="delete" onClick={deleteImage}>
              {loading ? "جار التحميل..." : "حذف"}
            </button>
            <button className="edit" onClick={enableEditMode}>
              {loading ? "جار التحميل..." : "تعديل"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
