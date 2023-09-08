import { useState } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import Select from "react-select";
import { Button, DatePicker, Input, InputNumber } from "antd";

export const transitionTypes = [
  { label: "دفع", value: "pay" },
  { label: "شراء", value: "purchase" },
  { label: "خصم", value: "discount" },
];
export default function CreateTransaction({ clientId, loadClient }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(transitionTypes[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await api.post(`/clients/${clientId}/transactions`, {
        type: type.value,
        amount,
        description,
        date: date.$d,
      });
      toast.success(`تم انشاء عملية ${type.label}`);
      loadClient();
      resetForm();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <h3>انشاء عملية</h3>
      <div className="control">
        <label>نوع العملية</label>
        <Select
          options={transitionTypes}
          defaultValue={type}
          onChange={(val) => setType(val)}
        />
      </div>
      <div className="control">
        <label htmlFor="amount">القيمة</label>
        <InputNumber
          id="amount"
          value={amount}
          onChange={(val) => setAmount(val)}
          placeholder="القيمة"
        />
      </div>
      <div className="control">
        <label htmlFor="desc">الوصف</label>
        <Input
          id="desc"
          placeholder="الوصف"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="control">
        <label>التاريخ</label>
        <DatePicker value={date} onChange={(d) => setDate(d)} />
      </div>
      <Button loading={loading} htmlType="submit">
        انشاء
      </Button>
    </form>
  );
}
