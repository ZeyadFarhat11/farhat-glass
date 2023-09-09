import image from "../../assets/images/brief-img.webp";
function Brief() {
  return (
    <div className="brief" id="brief">
      <div className="container">
        <div className="img">
          <img src={image} alt="brief" />
        </div>
        <div className="text">
          <h3 className="main-title">نبذة</h3>
          <p>
            تعد شركة فرحات للزجاج والسيكوريت من افضل واقوي الشركات في مجال
            الزجاج بجميع انواعه. تهتم الشركة بتقديم افضل العروض والاسعار للشركات
            والمستشفيات والبنوك والمحلات التجارية والفنادق والقري السياحية
            وكبائن الشاور للاشخاص. تعتمد الشركه علي المصداقيه في الخامات الموردة
            من حيث الجودة والدقة والشكل النهائي والالتزام بمواعيد التسليم.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Brief;
