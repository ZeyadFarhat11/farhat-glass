import useGlobalContext from "../../context/global.context";
import api from "../../utils/api";
import "./home.scss";
import { useEffect, useState } from "react";
function Home() {
  const [data, setData] = useState();
  const { setGlobalLoading } = useGlobalContext();
  const loadDate = async () => {
    setGlobalLoading(true);
    try {
      const response = await api.get("/home");
      setData(response.data);
    } catch (err) {
      alert("حدث خطأ ما");
      console.log(err);
    } finally {
      setGlobalLoading(false);
    }
  };
  useEffect(() => {
    loadDate();
  }, []);
  return (
    <main id="home">
      <div className="container box-grid">
        <div className="box">
          <h3 className="label">عدد العملاء</h3>
          <h3 className="value">{data?.clientsCount}</h3>
        </div>
        <div className="box">
          <h3 className="label">عدد الفواتير</h3>
          <h3 className="value">{data?.invoicesCount}</h3>
        </div>
        <div className="box">
          <h3 className="label">عدد فواتير عرض السعر</h3>
          <h3 className="value">{data?.offerPriceInvoicesCount}</h3>
        </div>
        <div className="box">
          <h3 className="label">باقي المستحقات</h3>
          <h3 className="value">{data?.remainingDebt} جنيه مصري</h3>
        </div>
      </div>
    </main>
  );
}

export default Home;
