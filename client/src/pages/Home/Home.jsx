import { Helmet } from "react-helmet";
import Brief from "../../components/Home/Brief";
import Landing from "../../components/Home/Landing";
import "./home.scss";
function Home() {
  return (
    <>
      <Helmet>
        <title>فرحات للزجاج والسيكوريت | الرئيسية</title>
      </Helmet>
      <Landing />
      <Brief />
    </>
  );
}

export default Home;
