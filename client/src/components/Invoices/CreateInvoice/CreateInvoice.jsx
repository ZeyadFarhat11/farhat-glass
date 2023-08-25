import Select from "react-select";
import { Input, InputNumber, Button, DatePicker } from "antd";
import InvoiceRow from "../../Invoices/InvoiceRow/InvoiceRow";
import { generateRandomNumber } from "../../../utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import "./create-invoice.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faPlus,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
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

const openInvoiceWindow = (url) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
};

const serializeRows = (rows) =>
  rows.map((row) => [row.title, row.qty, row.qtyUnit, row.price, row.total]);
const deserializeRows = (rows) =>
  rows.map((row) => ({
    title: row[0],
    qty: row[1],
    qtyUnit: row[2],
    price: row[3],
    total: row[4],
    id: generateRandomNumber(),
  }));

export default function CreateInvoice({
  active,
  loadInvoices,
  editingInvoice,
  setEditingInvoice,
}) {
  const [client, setClient] = useState({ value: "", label: "بدون عميل" });
  const [invoiceDate, setInvoiceDate] = useState(dayjs());
  const [invoiceTotal, setInvoiceTotal] = useState();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(initialRows);
  const [clients, setClients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [invoiceTitle, setInvoiceTitle] = useState("");
  let firstRender = useRef(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (editingInvoice) {
      handleEditSubmit();
      return;
    }
    try {
      const data = {
        rows: serializeRows(rows),
        date: invoiceDate,
        title: invoiceTitle,
      };
      if (client.value) data.client = client.value;
      const response = await api.post("/invoices", data);
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
  const resetForm = () => {
    setClient();
    setInvoiceTotal();
    setInvoiceTitle("");
    setInvoiceDate(dayjs());
    setRows(initialRows);
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        title: invoiceTitle,
        client: client?.value,
        date: invoiceDate.$d,
        rows: serializeRows(rows),
      };
      await api.put(`/invoices/${editingInvoice._id}`, data);
      toast.success("تم حفظ التغييرات بنجاح");
      resetForm();
      loadInvoices();
      setEditingInvoice();
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
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
      // handleError(err)
    }
  };
  const loadSuggestions = async () => {
    try {
      const response = await api.get("/suggestions");
      setSuggestions(response.data);
    } catch (err) {
      console.log(err);
      // handleError(err)
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

  const calcInvoiceTotal = () => {
    setInvoiceTotal(rows.map((row) => row.total).reduce((a, b) => a + b, 0));
  };

  const cancelEditing = () => {
    setEditingInvoice();
    resetForm();
  };
  useEffect(() => {
    loadClients();
    loadSuggestions();
  }, []);

  // Set editing invoice data
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (editingInvoice) {
      if (editingInvoice.client) {
        setClient({
          value: editingInvoice.client._id,
          label: editingInvoice.client.name,
        });
      } else {
        setClient({
          value: "",
          label: "بدون عميل",
        });
      }
      setRows(deserializeRows(editingInvoice.rows));
      setInvoiceDate(dayjs(editingInvoice.date));
      setInvoiceTotal(editingInvoice.total);
      setInvoiceTitle(editingInvoice.title);
    } else {
      setClient("");
      setRows(initialRows);
    }
  }, [editingInvoice]);

  const addRow = () => {
    const newRow = {
      title: "",
      price: "",
      qty: "",
      qtyUnit: "",
      total: "",
      id: generateRandomNumber(),
    };
    setRows((prev) => [...prev, newRow]);
  };

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
        <Select
          placeholder="اسم العميل"
          options={[{ label: "بدون عميل", value: "" }, ...clients]}
          onChange={(newValue) => setClient(newValue)}
          value={client}
        />
      </div>
      <div className="control">
        <Input
          type="text"
          onChange={(e) => setInvoiceTitle(e.target.value)}
          value={invoiceTitle}
          placeholder="عنوان الفاتورة"
        />
      </div>
      <div className="control">
        <InputNumber
          type="number"
          onChange={(total) => setInvoiceTotal(total)}
          placeholder="اجمالي الفاتورة"
          value={invoiceTotal}
          disabled
        />
        <Button
          htmlType="button"
          className="mt-1"
          size="small"
          onClick={calcInvoiceTotal}
        >
          حساب اجمالي الفاتورة
        </Button>
      </div>
      <div className="control">
        <DatePicker
          onChange={(date) => setInvoiceDate(date)}
          value={invoiceDate}
        />
      </div>
      <h4 className="mb-3">محتوي الفاتورة</h4>
      {rows.map((row) => (
        <InvoiceRow
          key={row.id}
          rows={rows}
          setRows={setRows}
          qtyUnits={suggestions?.qtyUnits}
          {...row}
        />
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
            onClick={cancelEditing}
          >
            الغاء التعديلات
          </Button>
        </>
      ) : (
        <div className="create-invoice-btns">
          <Button loading={loading} type="primary" htmlType="submit">
            انشاء فاتورة
          </Button>
          <Button type="dashed" htmlType="button" onClick={restoreLastInvoice}>
            استعادة اخر فاتورة
          </Button>

          <Button
            type="default"
            htmlType="button"
            onClick={addRow}
            className="add-row"
          >
            اضافة صف
            <FontAwesomeIcon icon={faPlusCircle} />
          </Button>
        </div>
      )}

      <datalist id="title-suggestions">
        {suggestions?.titles?.map((s, i) => (
          <option key={i} value={s}>
            {s}
          </option>
        ))}
      </datalist>
    </form>
  );
}
