import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";

export default function UploadImagePreview({ file, setFiles, types, type }) {
  const [imageUrl, setImageUrl] = useState();

  const deleteFile = () => {
    setFiles((files) => files.filter((e) => e !== file));
  };

  const changeFileType = (newType) => {
    setFiles((files) => {
      let fileArrFromFiles = files.find(([f]) => f === file);
      fileArrFromFiles[1] = newType;
      return [...files];
    });
  };

  useEffect(() => {
    setImageUrl(URL.createObjectURL(file));

    return () => URL.revokeObjectURL(imageUrl);
  }, [file]);

  return (
    <div className="upload-image-preview">
      <img src={imageUrl} alt={file?.name} />
      <button className="delete" onClick={deleteFile}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <p>نوع الصورة</p>
      <Select options={types} value={type} onChange={changeFileType} />
    </div>
  );
}
