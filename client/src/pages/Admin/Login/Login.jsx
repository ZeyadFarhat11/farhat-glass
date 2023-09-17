import { Button, Input } from "antd";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminApi } from "../../../utils/api";
import "./login.scss";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isAdmin = !!localStorage.token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    try {
      const res = await adminApi.post("/auth/login", { password });
      window.localStorage.token = res.data.token;
      toast.success("تم تسجيل الدخول!");
      navigate("/admin");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("كلمة مرور غير صالحة");
      } else {
        toast.error("حدث خطأ اثناء محاولة تسجيل الدخول");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) return <Navigate to="/admin" />;
  return (
    <main id="login">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h3>تسجيل الدخول</h3>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="كلمة المرور"
          />
          <Button htmlType="submit" loading={loading} type="primary">
            تسجيل الدخول
          </Button>
        </form>
      </div>
    </main>
  );
}
