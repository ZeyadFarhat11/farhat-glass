import { useEffect, useState } from "react";
import "./clients.scss";
import { Table, Space, Button, Input } from "antd";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

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
    dataIndex: "transactionsCount",
    key: "transactionsCount",
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
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  async function loadClients() {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  const deleteClient = async (client) => {
    if (!window.confirm(`هل انت متأكد من حذف ${client.name}`)) return;
    setLoading(true);
    try {
      await api.delete(`/clients/${client._id}`);
      toast.error(`تم حذف ${client.name} بنجاح`, { icon: false });
      loadClients();
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadClients();
  }, []);
  return (
    <main id="clients">
      <div className="container">
        <CreateClient {...{ loading, setLoading, loadClients }} />
        <h2 className="title">العملاء</h2>
        <Table
          columns={columns}
          dataSource={clients.map((c) => ({ ...c, deleteClient }))}
          rowKey={(r) => r._id}
        />
      </div>
    </main>
  );
}

function CreateClient({ loading, setLoading, loadClients }) {
  const [name, setName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.post("/clients", { name });
      toast.success("تم انشاء العميل بنجاح");
      loadClients();
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="اسم العميل"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="client-name"
      />
      <Button type="primary" loading={loading}>
        انشاء
      </Button>
    </form>
  );
}
