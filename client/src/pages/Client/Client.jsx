import { Link, useNavigate, useParams } from "react-router-dom";
import "./client.scss";
import useGlobalContext from "../../context/global.context";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Button, Input } from "antd";
import dayjs from "dayjs";

export default function Client() {
  const { clientId } = useParams();
  const { globalLoading, setGlobalLoading } = useGlobalContext();
  const [client, setClient] = useState();
  const navigate = useNavigate();

  const loadClient = async () => {
    setGlobalLoading(true);
    try {
      const res = await api.get(`/clients/${clientId}`);
      setClient(res.data);
    } catch (err) {
      console.log(err);
      navigate("/clients");
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadClient();
  }, []);
  return (
    <div className="container">
      <ClientForm
        client={client}
        loading={globalLoading}
        setLoading={setGlobalLoading}
        setClient={setClient}
      />
      <h3 className="mt-5 text-center">المعاملات</h3>
      <div className="transactions">
        {client?.transactions?.map((transaction, idx) => (
          <Transaction key={idx} {...transaction} />
        ))}
      </div>
    </div>
  );
}

function ClientForm({
  loading,
  setLoading,
  client = { name: "", debt: "" },
  setClient,
}) {
  const [name, setName] = useState();
  const [isEdited, setIsEdited] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.patch(`/clients/${client._id}`, { name });
      toast.success("تم تعديل العميل بنجاح");
      setClient(res.data);
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setName(client.name);
  }, [client]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="control mt-4">
        <label htmlFor="client-name">اسم العميل</label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setIsEdited(true);
          }}
          type="text"
          id="client-name"
        />
      </div>
      <div className="control">
        <label htmlFor="client-debt">الدين</label>
        <Input value={client.debt} disabled type="text" id="client-debt" />
      </div>
      <Button
        type="primary"
        loading={loading}
        htmlType="submit"
        disabled={!isEdited}
      >
        تعديل
      </Button>
    </form>
  );
}

function Transaction({ type, date, amount, description, invoice }) {
  return (
    <div className="transaction">
      <p>
        النوع : <span>{type === "purchase" ? "شراء" : "دفع"}</span>
      </p>
      <p>
        التاريخ : <span>{dayjs(date).format("YYYY-MM-DD")}</span>
      </p>
      <p>
        القيمة : <span>{amount}</span>
      </p>
      {description ? (
        <p>
          الوصف : <p>{description}</p>
        </p>
      ) : null}
      {invoice ? (
        <p>
          الفاتورة :{" "}
          <Link
            to={`${api.defaults.baseURL}/invoices/${invoice}`}
            target="_blank"
          >
            عرض الفاتورة
          </Link>
        </p>
      ) : null}
    </div>
  );
}
