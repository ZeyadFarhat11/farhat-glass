import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Space, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Calculator } from "react-mac-calculator";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CalcInvoicesTotal from "../../../components/Admin/Invoices/CalcInvoicesTotal.jsx";
import CreateInvoice from "../../../components/Admin/Invoices/CreateInvoice/CreateInvoice";
import useGlobalContext from "../../../context/globalContext";
import api from "../../../utils/api";
import "./invoices.scss";

window.dayjs = dayjs;

const columns = [
  {
    title: "العميل",
    render: (_, record) => record.client?.name,
    key: "client",
  },
  {
    title: "العنوان",
    render: (_, record) =>
      record.title + (record.priceOffer ? "(عرض سعر)" : ""),
    key: "title",
  },
  {
    title: "تاريخ الفاتورة",
    key: "invoiceDate",
    render: (_, record) => dayjs(record.date).format("YYYY-MM-DD"),
  },
  {
    title: "تاريخ الانشاء",
    key: "invoiceDate",
    render: (_, record) => dayjs(record.createdAt).format("YYYY-MM-DD"),
  },
  {
    title: "عدد الاصناف",
    render: (record) => record.rows.length,
    key: "rowsCount",
  },
  {
    title: "الاجمالي",
    dataIndex: "total",
    key: "total",
  },
  {
    title: "ادوات",
    key: "actions",
    render: (_, record) => (
      <Space size="middle" className="actions">
        <Link to={`/admin/invoice/${record._id}`} target="_blank">
          <FontAwesomeIcon icon={faEye} />
        </Link>
        <button onClick={() => record.editInvoice(record)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button onClick={() => record.deleteInvoice(record)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </Space>
    ),
  },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [createInvoiceActive, setCreateInvoiceActive] = useState(false);
  const [calcActive, setCalcActive] = useState(false);
  const [calcInvoicesTotalActive, setCalcInvoicesTotalActive] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState();
  const { setGlobalLoading } = useGlobalContext();
  async function loadInvoices() {
    setGlobalLoading(true);
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data.invoices);
    } catch (err) {
      console.log(err);
    } finally {
      setGlobalLoading(false);
    }
  }

  const deleteInvoice = async (invoice) => {
    if (
      !window.confirm(
        `هل انت متأكد من حذف الفاتورة الخاصة بالعميل ${
          invoice.client?.name || ""
        }`
      )
    )
      return;
    try {
      await api.delete(`/invoices/${invoice._id}`);
      toast.error(`تم حذف الفاتورة بنجاح`, { icon: false });
      loadInvoices();
    } catch (err) {
      console.log(err);
      // handleError(err)
    }
  };

  const editInvoice = (record) => {
    console.log(record);
    setEditingInvoice(record);
    setCreateInvoiceActive(true);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const dataSource = invoices
    .map((i) => ({
      ...i,
      deleteInvoice,
      editInvoice,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main id="invoices">
      <div className="container">
        <Button
          onClick={() => setCreateInvoiceActive((p) => !p)}
          className="my-3"
        >
          انشاء فاتورة
        </Button>
        <Button onClick={() => setCalcActive((p) => !p)} className="my-3 me-2">
          الالة الحاسبة
        </Button>
        <Button
          onClick={() => setCalcInvoicesTotalActive((p) => !p)}
          className="my-3 me-2"
        >
          حساب مجموع فواتير
        </Button>
        {calcActive && <Calculator />}
        <CalcInvoicesTotal
          active={calcInvoicesTotalActive}
          invoices={invoices}
        />
        <CreateInvoice
          active={createInvoiceActive}
          loadInvoices={loadInvoices}
          editingInvoice={editingInvoice}
          setEditingInvoice={setEditingInvoice}
        />
        <h2 className="title">الفـــــواتير</h2>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={(i) => i._id}
          bordered={true}
          pagination={false}
        />
      </div>
    </main>
  );
}
