import { useState } from "react";
import "./upload-gallery-images.scss";
import UploadImagePreview from "../../../../components/Admin/Gallery/UploadImagePreview";
import { adminApi } from "../../../../utils/api";
import { Button } from "antd";
import { faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

export const types = [
  { label: "واجهات سيكوريت", value: "frontage" },
  { label: "حمامات شاور", value: "shawer" },
  { label: "مرايات", value: "mirror" },
  { label: "استراكشر", value: "structure" },
  { label: "هاندريل سلالم", value: "staircase" },
  { label: "اخري", value: "other" },
];

const getFormData = (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file[0]);
    formData.append("types", file[1].value);
  });
  return formData;
};

export default function UploadGalleryImages() {
  const [files, setFiles] = useState([]);
  // const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      // setLoading(true);
      var toastId = toast("جار حفظ الصور...", { isLoading: true });
      const res = await adminApi.post("/gallery", getFormData(files));
      resetImages();
      toast.update(toastId, {
        type: "success",
        autoClose: 5000,
        render: "تم حفظ الصور بنجاح",
        isLoading: false,
      });
    } catch (err) {
      console.log(err);
      toast.update(toastId, {
        type: "success",
        autoClose: 5000,
        render: "حدث خطأ اثناء حفظ الصور",
        isLoading: false,
      });
    }
  };

  const resetImages = () => setFiles([]);

  const handleFileChange = (e) => {
    let newFiles = [...e.target.files].map((file) => [file, types[0]]);
    setFiles([...newFiles, ...files]);
  };

  return (
    <main id="gallery-upload">
      <div className="container mt-3">
        <label htmlFor="upload-files" className="d-block">
          <div
            className="btn btn-primary"
            style={{
              display: "flex",
              fontWeight: "bold",
              fontSize: "22px",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
            }}
          >
            ارفع صور
            <FontAwesomeIcon icon={faUpload} />
          </div>
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          id="upload-files"
          hidden
        />
      </div>

      <div className="container images-list">
        {files.map(([file, fileType], i) => (
          <UploadImagePreview
            file={file}
            setFiles={setFiles}
            types={types}
            type={fileType}
            key={i}
          />
        ))}
      </div>
      {!!files.length && (
        <div className="container mt-3">
          <div
            className="btn btn-success"
            onClick={handleSubmit}
            style={{
              display: "flex",
              fontWeight: "bold",
              fontSize: "22px",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
            }}
          >
            حفظ الصور
            <FontAwesomeIcon icon={faSave} />
          </div>
        </div>
      )}
    </main>
  );
}
