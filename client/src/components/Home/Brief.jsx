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
            تعتبر شركة فرحات للزجاج والسيكوريت من الشركات المتميزة في مجال
            الزجاج بجميع أنواعه. تهتم الشركة بتقديم أفضل العروض والأسعار للشركات
            والمستشفيات والبنوك والمحلات التجارية والفنادق والقرى السياحية
            وكبائن الشاور للأشخاص. تعتمد الشركة على المصداقية في الخامات الموردة
            من حيث الجودة والدقة والشكل النهائي والالتزام بمواعيد التسليم.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Brief;
