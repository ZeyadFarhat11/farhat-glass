import Select from "react-select";
import { Input, InputNumber, Button, DatePicker, Checkbox } from "antd";
import InvoiceRow from "../../Invoices/InvoiceRow/InvoiceRow";
import { generateRandomNumber } from "../../../utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import "./create-invoice.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const initialRows = [
  {
    title: "زجاج سيكوريت 10مل شفاف",
    price: "900",
    total: "",
    qty: "",
    qtyUnit: "م²",
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
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(initialRows);
  const [clients, setClients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [invoiceTitle, setInvoiceTitle] = useState("");
  const [priceOffer, setPriceOffer] = useState(false);
  const navigate = useNavigate();
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
        priceOffer,
      };
      if (client.value) data.client = client.value;
      const response = await api.post("/invoices", data);
      loadInvoices();
      toast.success("تم انشاء الفاتورة بنجاح");
      openInvoiceWindow(`/invoice/${response.data._id}`);
    } catch (err) {
      console.log(err);
      // handleError(err)
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setClient();
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
        priceOffer,
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
      setInvoiceTitle(editingInvoice.title);
      setPriceOffer(editingInvoice.priceOffer);
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
        invoiceTitle,
        invoiceDate,
        priceOffer,
      })
    );
  }, [rows, client, invoiceDate, priceOffer, invoiceTitle]);

  const invoiceTotal = rows
    .map((row) => row.total || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: active ? "block" : "none" }}
    >
      <h4 className="mb-3">معلومات الفاتورة</h4>
      <div className="control">
        <label htmlFor="client">اسم العميل</label>
        <Select
          placeholder="اسم العميل"
          options={[{ label: "بدون عميل", value: "" }, ...clients]}
          onChange={(newValue) => setClient(newValue)}
          value={client}
          id="client"
        />
      </div>
      <div className="control">
        <label htmlFor="title">عنوان الفاتورة</label>
        <Input
          type="text"
          onChange={(e) => setInvoiceTitle(e.target.value)}
          value={invoiceTitle}
          placeholder="عنوان الفاتورة"
          id="title"
        />
      </div>
      <div className="control">
        <label>اجمالي الفاتورة</label>
        <InputNumber
          type="number"
          placeholder="اجمالي الفاتورة"
          value={invoiceTotal}
          disabled
        />
      </div>
      <div className="control">
        <label htmlFor="date">التاريخ</label>
        <DatePicker
          id="date"
          onChange={(date) => setInvoiceDate(date)}
          value={invoiceDate}
        />
      </div>
      <div className="control">
        <label htmlFor="priceOffer">عرض سعر</label>
        <Checkbox
          checked={priceOffer}
          onChange={(e) => setPriceOffer(e.target.checked)}
          id="priceOffer"
          className="me-2"
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

      <div className="create-invoice-btns">
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
          <>
            <Button loading={loading} type="primary" htmlType="submit">
              انشاء فاتورة
            </Button>
            <Button
              type="dashed"
              htmlType="button"
              onClick={restoreLastInvoice}
            >
              استعادة اخر فاتورة
            </Button>
          </>
        )}

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
