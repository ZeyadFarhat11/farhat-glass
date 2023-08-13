import { useEffect, useState } from "react";
import "./clients.scss";
import { Table, Space, Button, Input, InputNumber } from "antd";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye, faEdit } from "@fortawesome/free-solid-svg-icons";
import useGlobalContext from "../../context/global.context";

const columns = [
  {
    title: "الاسم",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "الدين",
    dataIndex: "debt",
    key: "debt",
  },
  {
    title: "عدد المعاملات",
    dataIndex: "transactionCount",
    key: "transactionCount",
  },
  {
    title: "ادوات",
    key: "actions",
    render: (_, record) => (
      <Space size="middle" className="actions">
        <Link to={`/client/${record._id}`}>
          <FontAwesomeIcon icon={faEye} />
        </Link>
        <button onClick={() => record.deleteClient(record)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </Space>
    ),
  },
];

export default function Clients() {
  const { globalLoading, setGlobalLoading } = useGlobalContext();
  const [clients, setClients] = useState([]);
  const [currentEditClient, setCurrentEditClient] = useState();
  async function loadClients() {
    setGlobalLoading(true);
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setGlobalLoading(false);
    }
  }
  const deleteClient = async (client) => {
    if (!window.confirm(`هل انت متأكد من حذف ${client.name}`)) return;
    setGlobalLoading(true);
    try {
      await api.delete(`/clients/${client._id}`);
      toast.error(`تم حذف ${client.name} بنجاح`, { icon: false });
      loadClients();
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);
  return (
    <main id="clients">
      <div className="container">
        <CreateClient
          loading={globalLoading}
          setLoading={setGlobalLoading}
          loadClients={loadClients}
        />
        <h2 className="title">العملاء</h2>
        <Table
          columns={columns}
          dataSource={clients.map((c) => ({ ...c, deleteClient }))}
          rowKey={(r) => r._id}
          pagination={false}
        />
      </div>
    </main>
  );
}

function CreateClient({ loading, setLoading, loadClients }) {
  const [name, setName] = useState("");
  const [debt, setDebt] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await api.post("/clients", { name, debt: debt || 0 });
      toast.success("تم انشاء العميل بنجاح");
      loadClients();
      setName("");
      setDebt("");
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mt-4">عميل جديد</h4>
      <div className="control mt-3">
        <Input
          placeholder="اسم العميل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </div>
      <div className="control">
        <InputNumber
          placeholder="الدين"
          value={debt}
          onChange={(debt) => setDebt(debt)}
        />
      </div>
      <Button type="primary" htmlType="submit">
        انشاء
      </Button>
    </form>
  );
}
function EditClient({
  loading,
  setLoading,
  loadClients,
  client,
  setCurrentEditClient,
}) {
  const [name, setName] = useState(client.name);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await api.patch(`/clients/${client._id}`, { name });
      toast.success("تم تعديل العميل بنجاح");
      loadClients();
      setCurrentEditClient();
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="control mt-4">
        <Input
          placeholder="اسم العميل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </div>
      <Button type="primary" loading={loading} htmlType="submit">
        تعديل
      </Button>
    </form>
  );
}
