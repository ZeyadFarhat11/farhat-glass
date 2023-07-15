import "./home.scss";

function Home() {
  return (
    <main id="home">
      <div className="container box-grid">
        <div className="box">
          <h3 className="label">عدد العملاء</h3>
          <h3 className="value">50</h3>
        </div>
        <div className="box">
          <h3 className="label">عدد الفواتير</h3>
          <h3 className="value">50</h3>
        </div>
        <div className="box">
          <h3 className="label">باقي المستحقات</h3>
          <h3 className="value">150,000</h3>
        </div>
      </div>
    </main>
  );
}

export default Home;
