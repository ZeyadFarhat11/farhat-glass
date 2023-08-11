import { Link, useNavigate, useParams } from "react-router-dom";
import "./client.scss";
import useGlobalContext from "../../context/global.context";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Button, Input, InputNumber } from "antd";
import dayjs from "dayjs";
import Select from "react-select";
import { toast } from "react-toastify";

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
      <MakeTransactionForm clientId={clientId} loadClient={loadClient} />
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
      <Button type="primary" loading={loading} disabled={!isEdited}>
        تعديل
      </Button>
    </form>
  );
}

const transitionTypes = [
  { label: "دفع", value: "pay" },
  { label: "شراء", value: "purchase" },
];
function MakeTransactionForm({ clientId, loadClient }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(transitionTypes[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/clients/${clientId}/transactions`, {
        type: type.value,
        amount,
        description,
      });
      toast.success(`تم انشاء عملية ${type.label}`);
      loadClient();
      resetForm();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <h3>انشاء عملية</h3>
      <div className="control">
        <label>نوع العملية</label>
        <Select
          options={transitionTypes}
          defaultValue={type}
          onChange={(val) => setType(val)}
        />
      </div>
      <div className="control">
        <label htmlFor="amount">القيمة</label>
        <InputNumber
          id="amount"
          value={amount}
          onChange={(val) => setAmount(val)}
          placeholder="القيمة"
        />
      </div>
      <div className="control">
        <label htmlFor="desc">الوصف</label>
        <Input
          id="desc"
          placeholder="الوصف"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button loading={loading} htmlType="submit">
        انشاء
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
        التاريخ : <span>{dayjs(date).format("YYYY-MM-DD hh:mm")}</span>
      </p>
      <p>
        القيمة : <span>{amount}</span>
      </p>
      {description ? (
        <p>
          الوصف : <span>{description}</span>
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
