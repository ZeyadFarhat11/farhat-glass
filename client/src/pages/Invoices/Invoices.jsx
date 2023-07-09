import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { Table, Space, Input, InputNumber, Button, DatePicker } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faMinusCircle,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./invoices.scss";
import { cls } from "../../utils";

const columns = [
  {
    title: "العميل",
    render: (_, record) => record.client?.name,
    key: "client",
  },
  {
    title: "تاريخ الفاتورة",
    key: "invoiceDate",
    render: (_, record) =>
      new Date(record.invoiceDate)
        .toLocaleDateString({
          language: "ar",
        })
        .replace(/\//g, "-"),
  },
  {
    title: "تاريخ الانشاء",
    key: "invoiceDate",
    render: (_, record) =>
      new Date(record.createdAt)
        .toLocaleDateString({
          language: "ar",
        })
        .replace(/\//g, "-"),
  },
  {
    title: "عدد الاصناف",
    dataIndex: "rowsCount",
    key: "rowsCount",
  },
  {
    title: "ادوات",
    key: "actions",
    render: (_, record) => (
      <Space size="middle" className="actions">
        <Link
          to={`${api.defaults.baseURL}/invoices/${record._id}`}
          target="_blank"
        >
          <FontAwesomeIcon icon={faEye} />
        </Link>
        <button onClick={() => record.deleteInvoice(record)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </Space>
    ),
  },
];

const serializeRows = (rows) =>
  rows.map((row) => [row.title, row.qty, row.price, row.total]);

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createInvoiceActive, setCreateInvoiceActive] = useState(false);

  async function loadInvoices() {
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data);
    } catch (err) {
      console.log(err);
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
    setLoading(true);
    try {
      await api.delete(`/invoices/${invoice._id}`);
      toast.error(`تم حذف الفاتورة بنجاح`, { icon: false });
      loadInvoices();
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <main id="invoices">
      <div className="container">
        <button
          onClick={() => setCreateInvoiceActive((p) => !p)}
          className={cls("main-btn", createInvoiceActive ? "active" : "")}
        >
          انشاء فاتورة
        </button>
        {createInvoiceActive && <CreateInvoice />}
        <h2 className="title">الفـــــواتير</h2>
        <Table
          columns={columns}
          dataSource={invoices.map((i) => ({ ...i, deleteInvoice }))}
          rowKey={(i) => i._id}
          bordered={true}
          pagination={false}
        />
      </div>
    </main>
  );
}

const initialRows = [
  {
    title: "زجاج سيكوريت",
    price: 850,
    total: 5200,
    qty: "220*90",
    id: Math.floor(Math.random() * 1000000) + 1,
  },
  {
    title: "اكسسوار",
    price: "",
    total: "3420",
    qty: "",
    id: Math.floor(Math.random() * 1000000) + 1,
  },
];

function CreateInvoice({}) {
  const [client, setClient] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(Date.now());
  const [invoiceTotal, setInvoiceTotal] = useState();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(initialRows);
  const [clientNames, setClientNames] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.post("/invoices", {
        rows: serializeRows(rows),
        date: invoiceDate || undefined,
        invoiceTotal: invoiceTotal || undefined,
        client: client || undefined,
      });
      // toast.success("تم انشاء الفاتورة بنجاح");
      window.location = response.data.url;
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };
  const loadClientNames = async () => {
    try {
      const response = await api.get("/clients/names");
      setClientNames(response.data);
    } catch (err) {
      console.log(err);
      // handleError(err)
    }
  };
  useEffect(() => {
    loadClientNames();
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mb-3">معلومات الفاتورة</h4>
      <div className="control">
        <Input
          type="text"
          onChange={(e) => setClient(e.target.value)}
          defaultValue={client}
          placeholder="اسم العميل"
          list="client-names"
        />
      </div>
      <div className="control">
        <InputNumber
          type="number"
          onChange={(total) => setInvoiceTotal(total)}
          min={0}
          max={1000000}
          placeholder="اجمالي الفاتورة"
        />
      </div>
      <div className="control">
        <DatePicker onChange={(date) => setInvoiceDate(date.$d.getTime())} />
      </div>
      <h4 className="mb-3">محتوي الفاتورة</h4>
      {rows.map((row) => (
        <InvoiceRow key={row.id} {...row} setRows={setRows} rows={rows} />
      ))}
      <Button loading={loading} type="primary" htmlType="submit">
        انشاء فاتورة
      </Button>
      <datalist id="client-names">
        {clientNames.map((name, i) => (
          <option value={name} key={i}>
            {name}
          </option>
        ))}
      </datalist>
    </form>
  );
}

function InvoiceRow({ title, price, qty, total, id, setRows, rows }) {
  const handleChange = (field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };
  const deleteRow = () => {
    if (rows.length <= 1) return;
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };
  const addRow = () => {
    const currentRowIndex = rows.findIndex((row) => row.id === id);
    const newRow = {
      title: "",
      price: "",
      qty: "",
      total: "",
      id: Math.floor(Math.random() * 1000000) + 1,
    };
    rows.splice(currentRowIndex + 1, 0, newRow);
    setRows([...rows]);
  };
  return (
    <div className="row-control">
      <Input
        type="text"
        placeholder="الصنف"
        name="title"
        defaultValue={title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
      <Input
        type="text"
        name="qty"
        placeholder="الكمية"
        defaultValue={qty}
        onChange={(e) => handleChange("qty", e.target.value)}
      />
      <InputNumber
        name="price"
        maxLength={6}
        placeholder="السعر"
        onChange={(value) => handleChange("price", value)}
        defaultValue={price}
      />
      <InputNumber
        maxLength={10}
        name="total"
        placeholder="الاجمالي"
        onChange={(value) => handleChange("total", value)}
        defaultValue={total}
      />
      <div className="row-actions">
        <button className="add" onClick={addRow} type="button">
          <FontAwesomeIcon icon={faPlusCircle} />
        </button>
        <button className="delete" onClick={deleteRow} type="button">
          <FontAwesomeIcon icon={faMinusCircle} />
        </button>
      </div>
    </div>
  );
}
