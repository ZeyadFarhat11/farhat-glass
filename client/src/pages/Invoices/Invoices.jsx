import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { Table, Space, Input, InputNumber, Button, DatePicker } from "antd";
import { Calculator } from "react-mac-calculator";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./invoices.scss";
import InvoiceRow from "../../components/InvoiceRow/InvoiceRow";
import { generateRandomNumber } from "../../utils";
import dayjs from "dayjs";

window.dayjs = dayjs;

const openInvoiceWindow = (url) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
};

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
    title: "تاريخ الفاتورة",
    key: "invoiceDate",
    render: (_, record) => dayjs(record.invoiceDate).format("YYYY-MM-DD"),
  },
  {
    title: "تاريخ الانشاء",
    key: "invoiceDate",
    render: (_, record) => dayjs(record.invoiceDate).format("YYYY-MM-DD"),
  },
  {
    title: "عدد الاصناف",
    dataIndex: "rowsCount",
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
        <Link
          to={`${api.defaults.baseURL}/invoices/${record._id}`}
          target="_blank"
        >
          <FontAwesomeIcon icon={faEye} />
        </Link>
        <button onClick={() => record.deleteInvoice(record)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button onClick={() => record.editInvoice(record)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </Space>
    ),
  },
];

const serializeRows = (rows) =>
  rows.map((row) => [row.title, row.qty, row.qtyUnit, row.price, row.total]);

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createInvoiceActive, setCreateInvoiceActive] = useState(false);
  const [calcActive, setCalcActive] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState();

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

  const editInvoice = (record) => {
    console.log(record);
    setEditingInvoice(record);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

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
        {calcActive && <Calculator />}
        <CreateInvoice
          active={createInvoiceActive}
          loadInvoices={loadInvoices}
          editingInvoice={editingInvoice}
          setEditingInvoice={setEditingInvoice}
        />
        <h2 className="title">الفـــــواتير</h2>
        <Table
          columns={columns}
          dataSource={invoices.map((i) => ({
            ...i,
            deleteInvoice,
            editInvoice,
          }))}
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
    title: "",
    price: "",
    total: "",
    qty: "",
    qtyUnit: "",
    id: generateRandomNumber(),
  },
];

function CreateInvoice({
  active,
  loadInvoices,
  editingInvoice,
  setEditingInvoice,
}) {
  const [client, setClient] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(dayjs());
  const [invoiceTotal, setInvoiceTotal] = useState();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(initialRows);
  const [clientNames, setClientNames] = useState([]);
  const [rowTitleSuggestions, setRowTitleSuggestions] = useState([]);
  const [invoiceTitle, setInvoiceTitle] = useState("");
  const [qtyUnits, setQtyUnits] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (editingInvoice) {
      handleEditSubmit();
      return;
    }
    try {
      const response = await api.post("/invoices", {
        rows: serializeRows(rows),
        date: invoiceDate || undefined,
        total: invoiceTotal || undefined,
        client: client || undefined,
        title: invoiceTitle,
      });
      loadInvoices();
      toast.success("تم انشاء الفاتورة بنجاح");
      openInvoiceWindow(response.data.url);
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {};

  const loadClientNames = async () => {
    try {
      const response = await api.get("/clients/names");
      setClientNames(response.data);
    } catch (err) {
      console.log(err);
      // handleError(err)
    }
  };

  const loadRowTitleSuggestions = async () => {
    try {
      const response = await api.get("/invoices/suggestions");
      setRowTitleSuggestions(response.data);
    } catch (err) {
      console.log(err);
      // handleError(err)
    }
  };

  const loadQtyUnits = async () => {
    try {
      const response = await api.get("/invoices/quantity-units");
      setQtyUnits(response.data);
    } catch (err) {
      // handleErr(err);
      console.log(err);
    }
  };

  const restoreLastInvoice = () => {
    if (localStorage.invoice) {
      const storedInvoice = JSON.parse(localStorage.invoice);
      setClient(storedInvoice.client || "");
      setRows(storedInvoice.rows || []);
    } else {
      toast.error("لا يوجد فاتورة محفوظة");
    }
  };

  const fillData = (record) => {
    setClient(record.client.name);
    setRows(
      record.rows.map((row) => ({
        title: row[0],
        qty: row[1],
        qtyUnit: row[2],
        price: row[3],
        total: row[4],
        id: generateRandomNumber(),
      }))
    );
  };

  const cancelEditing = () => {
    setEditingInvoice(null);
    setRows(initialRows);
    setClient("");
    setInvoiceTotal("");
    setInvoiceTitle("");
    setInvoiceDate(dayjs());
  };

  useEffect(() => {
    loadClientNames();
    loadRowTitleSuggestions();
    loadQtyUnits();
  }, []);

  let firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (editingInvoice) {
      setClient(editingInvoice.client.name);
      setRows(
        editingInvoice.rows.map((row) => ({
          title: row[0],
          qty: row[1],
          qtyUnit: row[2],
          price: row[3],
          total: row[4],
          id: generateRandomNumber(),
        }))
      );
    } else {
      setClient("");
      setRows(initialRows);
    }
  }, [editingInvoice]);

  // Save Invoice to Local Storage on Change
  useEffect(() => {
    if (rows.length === 1 && !rows[0].title) return;
    localStorage.setItem(
      "invoice",
      JSON.stringify({
        client,
        rows,
      })
    );
  }, [rows, client, invoiceDate, invoiceTotal]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: active ? "block" : "none" }}
    >
      <h4 className="mb-3">معلومات الفاتورة</h4>
      <div className="control">
        <Input
          type="text"
          onChange={(e) => setClient(e.target.value)}
          value={client}
          placeholder="اسم العميل"
          list="client-names"
        />
      </div>
      <div className="control">
        <Input
          type="text"
          onChange={(e) => setInvoiceTitle(e.target.value)}
          placeholder="عنوان الفاتورة"
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
        <DatePicker
          onChange={(date) => setInvoiceDate(date)}
          value={invoiceDate}
        />
      </div>
      <h4 className="mb-3">محتوي الفاتورة</h4>
      {rows.map((row) => (
        <InvoiceRow key={row.id} {...row} {...{ rows, setRows, qtyUnits }} />
      ))}

      {editingInvoice ? (
        <>
          <Button loading={loading} type="primary" htmlType="submit">
            حفظ التعديلات
          </Button>
          <Button
            loading={loading}
            type="default"
            htmlType="button"
            className="me-4"
            onClick={cancelEditing}
          >
            الغاء التعديلات
          </Button>
        </>
      ) : (
        <>
          <Button loading={loading} type="primary" htmlType="submit">
            انشاء فاتورة
          </Button>
          <Button
            loading={loading}
            type="dashed"
            htmlType="button"
            onClick={restoreLastInvoice}
            className="me-4"
          >
            استعادة اخر فاتورة
          </Button>
        </>
      )}

      <datalist id="client-names">
        {clientNames.map((name, i) => (
          <option value={name} key={i}>
            {name}
          </option>
        ))}
      </datalist>
      <datalist id="title-suggestions">
        {rowTitleSuggestions.map((s, i) => (
          <option key={i} value={s}>
            {s}
          </option>
        ))}
      </datalist>
    </form>
  );
}
