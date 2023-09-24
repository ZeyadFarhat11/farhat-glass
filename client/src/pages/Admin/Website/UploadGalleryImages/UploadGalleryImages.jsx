import { useState } from "react";
import "./upload-gallery-images.scss";
import UploadImagePreview from "../../../../components/Admin/Gallery/UploadImagePreview";
import { adminApi } from "../../../../utils/api";
import { Button } from "antd";

const types = [
  { label: "واجهات سيكوريت", value: "frontage" },
  { label: "حمامات شاور", value: "shawer" },
  { label: "مرايات", value: "mirror" },
  { label: "استراكشر", value: "structure" },
  { label: "هاندريل سلالم", value: "staircase" },
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await adminApi.post("/gallery", getFormData(files));
      resetImages();
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
        <label htmlFor="upload-files">
          <div className="btn btn-primary">ارفع صور</div>
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
          <Button onClick={handleSubmit} loading={loading}>
            حفظ الصور
          </Button>
        </div>
      )}
    </main>
  );
}
