import { Button, DatePicker, Input, InputNumber } from "antd";
import Overlay from "../Overlay/Overlay";
import Select from "react-select";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { transitionTypes } from "./CreateTransaction";

export default function EditTransaction({
  setEditingTransaction,
  editingTransaction,
  client,
  loadClient,
}) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await api.patch(
        `/clients/${client._id}/transactions/${editingTransaction._id}`,
        { type: type.value, amount, description, date: date.$d }
      );
      toast.success("تم تعديل المعاملة بنجاح");
      loadClient();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setEditingTransaction(null);
    }
  };

  useEffect(() => {
    console.log("edit transaction render");
    setType(transitionTypes.find((e) => e.value === editingTransaction.type));
    setAmount(editingTransaction.amount);
    setDescription(editingTransaction.description);
    setDate(dayjs(editingTransaction.date));
  }, []);

  return (
    <>
      <div className="edit-transaction-form">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">تعديل معاملة</h3>
          <div className="control">
            <label>نوع العملية</label>
            <Select
              options={transitionTypes}
              value={type}
              onChange={(val) => setType(val)}
            />
          </div>
          <div className="control">
            <label htmlFor="e-amount">القيمة</label>
            <InputNumber
              id="e-amount"
              value={amount}
              onChange={(val) => setAmount(val)}
              placeholder="القيمة"
            />
          </div>
          <div className="control">
            <label htmlFor="e-desc">الوصف</label>
            <Input
              id="e-desc"
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
            تعديل
          </Button>
        </form>
      </div>
      <Overlay active={true} onClick={() => setEditingTransaction(null)} />
    </>
  );
}
