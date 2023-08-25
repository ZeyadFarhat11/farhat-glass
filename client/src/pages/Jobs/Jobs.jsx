import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useGlobalContext from "../../context/global.context";
import api from "../../utils/api";
import "./jobs.scss";
import Select from "react-select";

const columns = [
  {
    title: "العميل",
    render: (_, record) => record.client?.name,
    key: "client",
  },
  {
    title: "العنوان",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "عدد الفواتير",
    render: (_, record) => record.invoices?.length || 0,
    key: "invoicesCount",
  },
  {
    title: "ادوات",
    key: "actions",
    render: (_, record) => (
      <Space size="middle" className="table-actions">
        <Link to={`/job/${record._id}`}>
          <FontAwesomeIcon icon={faEye} />
        </Link>
        <button onClick={() => record.deleteJob(record)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </Space>
    ),
  },
];

export default function Jobs() {
  const { globalLoading, setGlobalLoading } = useGlobalContext();
  const [jobs, setJobs] = useState([]);
  const [createJobActive, setCreateJobActive] = useState(false);
  async function loadJobs() {
    setGlobalLoading(true);
    try {
      const response = await api.get("/jobs");
      setJobs(response.data.jobs);
    } catch (err) {
      console.log(err);
    } finally {
      setGlobalLoading(false);
    }
  }

  const deleteJob = async (job) => {
    setGlobalLoading(true);
    try {
      await api.delete(`/job/${job._id}`, {
        headers: { confirmation: prompt("رمز الأمان") },
      });
      toast.error(`تم حذف العمل بنجاح`, { icon: false });
      loadJobs();
    } catch (err) {
      console.log(err);
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);
  return (
    <main id="jobs">
      <div className="container">
        <div className="btns mt-3">
          <Button onClick={() => setCreateJobActive((p) => !p)}>
            انشاء عمل
          </Button>
        </div>
        <CreateJob active={createJobActive} loadJobs={loadJobs} />
        <h2 className="text-center my-4">الاعمال</h2>
        <Table
          columns={columns}
          dataSource={jobs.map((c) => ({ ...c, deleteJob }))}
          rowKey={(r) => r._id}
          pagination={false}
        />
      </div>
    </main>
  );
}

const initialClient = { value: "", label: "بدون عميل" };

function CreateJob({ loadJobs, active }) {
  const [title, setTitle] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(initialClient);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await api.post("/job", { title, client: client.value });
      toast.success("تم انشاء العمل بنجاح");
      loadJobs();
      resetForm();
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setClient(initialClient);
  };

  const loadClients = async () => {
    try {
      const response = await api.get("/clients?fields=name");
      setClients(
        response.data.map((client) => ({
          label: client.name,
          value: client._id,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadClients();
    // loadSuggestions();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: active ? "block" : "none" }}
    >
      <h4 className="mt-4">عمل جديد</h4>

      <div className="control mt-3">
        <label>العميل</label>
        <Select
          placeholder="اسم العميل"
          options={[{ label: "بدون عميل", value: "" }, ...clients]}
          onChange={(newValue) => setClient(newValue)}
          value={client}
        />
      </div>
      <div className="control">
        <label htmlFor="job-title">عنوان العمل</label>
        <Input
          id="job-title"
          placeholder="عنوان العمل"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
        />
      </div>
      <Button type="primary" htmlType="submit">
        انشاء
      </Button>
    </form>
  );
}
// function EditClient({
//   loading,
//   setLoading,
//   loadClients,
//   client,
//   setCurrentEditClient,
// }) {
//   const [name, setName] = useState(client.name);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);
//     try {
//       await api.patch(`/clients/${client._id}`, { name });
//       toast.success("تم تعديل العميل بنجاح");
//       loadClients();
//       setCurrentEditClient();
//     } catch (err) {
//       console.log(err);
//       // handleError(err)
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="control mt-4">
//         <Input
//           placeholder="اسم العميل"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           type="text"
//         />
//       </div>
//       <Button type="primary" loading={loading} htmlType="submit">
//         تعديل
//       </Button>
//     </form>
//   );
// }
