import { ScaleLoader } from "react-spinners";
import "./fall-back-loading.scss";
export default function FallBackLoading() {
  return (
    <div className="fall-back-loading">
      <div className="wrapper">
        <ScaleLoader />
        <h3>جار التحميل ...</h3>
      </div>
    </div>
  );
}
