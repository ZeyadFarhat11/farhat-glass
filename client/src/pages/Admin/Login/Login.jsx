import { useState } from "react";
import { Input, Button } from "antd";
import "./login.scss";
import useGlobalContext from "../../../context/globalContext";
import api from "../../../utils/api";
import { toast } from "react-toastify";

function Login() {
  const { setGlobalLoading, globalLoading } = useGlobalContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (globalLoading) return;
    setGlobalLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      sessionStorage.token = response.data.token;
      toast.success("تم تسجيل الدخول!");
    } catch (err) {
      alert("فشل تسجيل الدخول");
      console.log(err);
    } finally {
      setGlobalLoading(false);
    }
  };
  return (
    <main id="login">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h3>تسجيل الدخول</h3>
          <Input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="اسم المستخدم"
          />
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="كلمة المرور"
          />
          <Button>تسجيل الدخول</Button>
        </form>
      </div>
    </main>
  );
}

export default Login;
