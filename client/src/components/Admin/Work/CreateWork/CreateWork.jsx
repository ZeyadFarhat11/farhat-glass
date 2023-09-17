import { useEffect, useState } from "react";
import api, { adminApi } from "../../../../utils/api";
import { toast } from "react-toastify";
import { Button, Input, InputNumber } from "antd";
import Select from "react-select";

const initialClient = { value: "", label: "بدون عميل" };

export default function CreateWork({ loadWorks, active }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(initialClient);
  const [expectedWorkDays, setExpectedWorkDays] = useState();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const { clients } = useClients();
  const { invoices } = useInvoices();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await adminApi.post("/work", {
        title,
        client: client.value,
        expectedWorkDays,
      });
      toast.success("تم انشاء العمل بنجاح");
      loadWorks();
      resetForm();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setClient(initialClient);
  };

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
        <label htmlFor="work-title">عنوان العمل</label>
        <Input
          id="work-title"
          placeholder="عنوان العمل"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
        />
      </div>
      <div className="control">
        <label htmlFor="work-expected-days">ايام العمل المتوقعة</label>
        <InputNumber
          id="work-expected-days"
          placeholder="ايام العمل المتوقعة"
          value={expectedWorkDays}
          onChange={(val) => setExpectedWorkDays(val)}
        />
      </div>
      <div className="control">
        <label htmlFor="work-invoices">فواتير العمل</label>
        <Select
          id="work-invoices"
          placeholder="فواتير العمل"
          options={invoices}
          isMulti
          onChange={(e) => console.log(e)}
        />
      </div>
      <Button type="primary" htmlType="submit">
        انشاء
      </Button>
    </form>
  );
}

function useClients() {
  const [clients, setClients] = useState([]);

  const loadClients = async () => {
    try {
      const response = awaitget("/clients?fields=name");
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
  }, []);

  return { clients, setClients };
}
function useInvoices() {
  const [invoices, setInvoices] = useState([]);

  const loadInvoices = async () => {
    try {
      const response = await adminApi.get(
        "/invoices?fields=title,client,total"
      );
      setInvoices(
        response.data.invoices.map((invoice) => ({
          label: `${invoice.client?.name} | ${invoice.title} | ${invoice.total}`,
          value: invoice._id,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  return { invoices, setInvoices };
}
