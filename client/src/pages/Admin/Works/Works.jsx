import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CreateWork from "../../../components/Admin/Work/CreateWork/CreateWork";
import useGlobalContext from "../../../context/globalContext";
import api, { adminApi } from "../../../utils/api";
import "./works.scss";

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
        <Link to={`/work/${record._id}`}>
          <FontAwesomeIcon icon={faEye} />
        </Link>
        <button onClick={() => record.deleteWork(record)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </Space>
    ),
  },
];

export default function Works() {
  const [createWorkActive, setCreateWorkActive] = useState(false);
  const { setGlobalLoading } = useGlobalContext();
  const { works, setWorks, loadWorks } = useGetWorks();

  const deleteWork = async (work) => {
    setGlobalLoading(true);
    try {
      await adminApi.delete(`/work/${work._id}`, {
        headers: { confirmation: prompt("رمز الأمان") },
      });
      toast.error(`تم حذف العمل بنجاح`, { icon: false });
      loadWorks();
    } catch (err) {
      console.log(err);
    } finally {
      setGlobalLoading(false);
    }
  };
  return (
    <main id="works">
      <div className="container">
        <div className="btns mt-3">
          <Button onClick={() => setCreateWorkActive((p) => !p)}>
            انشاء عمل
          </Button>
        </div>
        <CreateWork active={createWorkActive} loadWorks={loadWorks} />
        <h2 className="text-center my-4">الاعمال</h2>
        <Table
          columns={columns}
          dataSource={works.map((c) => ({ ...c, deleteWork }))}
          rowKey={(r) => r._id}
          pagination={false}
        />
      </div>
    </main>
  );
}

function useGetWorks() {
  const { setGlobalLoading } = useGlobalContext();
  const [works, setWorks] = useState([]);

  async function loadWorks() {
    setGlobalLoading(true);
    try {
      const response = await adminApi.get("/works");
      setWorks(response.data.works);
    } catch (err) {
      console.log(err);
    } finally {
      setGlobalLoading(false);
    }
  }
  useEffect(() => {
    loadWorks();
  }, []);
  return { works, setWorks, loadWorks };
}
