import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Input, InputNumber, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { adminApi } from "../../../utils/api";
import useGlobalContext from "../../../context/globalContext";
import "./clients.scss";

const columns = [
  {
    title: "الاسم",
    key: "name",
    render: (record) => record.name + (record.vendor ? " (بائع)" : ""),
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
        <Link to={`/admin/client/${record._id}`}>
          <FontAwesomeIcon icon={faEye} />
        </Link>
        <button onClick={() => record.deleteClient(record)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </Space>
    ),
  },
];

const sortHandle = (a, b) => {
  return new Date(b.createdAt) - new Date(a.createdAt);
};

export default function Clients() {
  const { globalLoading, setGlobalLoading } = useGlobalContext();
  const [clients, setClients] = useState([]);
  async function loadClients() {
    setGlobalLoading(true);
    try {
      const response = await adminApi.get("/clients");
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
      await adminApi.delete(`/clients/${client._id}`);
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
          dataSource={clients
            .map((c) => ({ ...c, deleteClient }))
            .sort(sortHandle)}
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
  const [vendor, setVendor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await adminApi.post("/clients", { name, debt: debt || 0, vendor });
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
      <div className="control">
        <label htmlFor="vendor">بائع</label>
        <Checkbox
          checked={vendor}
          onChange={(e) => setVendor(e.target.checked)}
          id="vendor"
          className="me-2"
        />
      </div>
      <Button type="primary" htmlType="submit">
        انشاء
      </Button>
    </form>
  );
}
