import img1 from "../../assets/images/about-img1.png";
import img2 from "../../assets/images/about-img2.png";

function Brief() {
  return (
    <div className="about-brief">
      <div className="container">
        <div className="imgs">
          <div className="img">
            <img src={img1} alt="glass building" />
          </div>
          <div className="img">
            <img src={img2} alt="glass building" />
          </div>
        </div>
        <div className="text">
          <div className="title">
            <span>نبذة عن</span>
            <h2>شركة فرحات للزجاج والسيكوريت</h2>
          </div>
          <p>
            وريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دول
            أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت
            انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي
            يت أليكيوب أكس أيا كوممودو كونسيكيوات . ديواس أيوتي أريري دولار إن
            ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو فيجايت
            نيولا باراياتيور. أيكسسيبتيور ساينت أوككايكات كيوبايداتات نون
            بروايدينت ,سيونت ان كيولبا كيو أوفيسيا ديسيريونتموليت انيم أيدي ايست
            لابوريوم.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Brief;
