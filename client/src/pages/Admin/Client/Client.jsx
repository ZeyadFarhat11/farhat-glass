import { Button, Checkbox, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CreateTransaction from "../../../components/Admin/Client/CreateTransaction";
import EditTransaction from "../../../components/Admin/Client/EditTransction";
import Transaction from "../../../components/Admin/Client/Transaction";
import api, { adminApi } from "../../../utils/api";
import "./client.scss";

const Context = React.createContext();

export default function Client() {
  const { clientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const navigate = useNavigate();

  const loadClient = async () => {
    try {
      const res = await adminApi.get(`/clients/${clientId}`);
      setClient(res.data);
    } catch (err) {
      console.log(err);
      navigate("/clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClient();
  }, []);

  const value = {
    loadClient,
    client,
    setClient,
    loading,
    setLoading,
    editingTransaction,
    setEditingTransaction,
  };

  if (loading) return <h3>جار التحميل...</h3>;

  return (
    <Context.Provider value={value}>
      <div className="container">
        <ClientForm client={client} setClient={setClient} />
        <CreateTransaction clientId={clientId} loadClient={loadClient} />
        <h3 className="mt-5 text-center">المعاملات</h3>
        <div className="transactions">
          {client?.transactions?.map((transaction, idx) => (
            <Transaction
              key={idx}
              {...transaction}
              client={client}
              loadClient={loadClient}
              transaction={transaction}
              setEditingTransaction={setEditingTransaction}
            />
          ))}
        </div>
        {!!editingTransaction && (
          <EditTransaction
            setEditingTransaction={setEditingTransaction}
            editingTransaction={editingTransaction}
            client={client}
            loadClient={loadClient}
          />
        )}
      </div>
    </Context.Provider>
  );
}

function ClientForm({ client, setClient }) {
  const [name, setName] = useState(client.name);
  const [vendor, setVendor] = useState(client.vendor);
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log(`test`);
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await adminApi.patch(`/clients/${client._id}`, {
        name,
        vendor,
      });
      toast.success("تم تعديل العميل بنجاح");
      setClient(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="control mt-4">
        <label htmlFor="client-name">اسم العميل</label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setIsEdited(true);
          }}
          type="text"
          id="client-name"
        />
      </div>
      <div className="control">
        <label htmlFor="client-debt">الدين</label>
        <Input value={client.debt} disabled type="text" id="client-debt" />
      </div>
      <div className="control">
        <label htmlFor="vendor">بائع</label>
        <Checkbox
          checked={vendor}
          onChange={(e) => {
            setIsEdited(true);
            setVendor(e.target.checked);
          }}
          id="vendor"
          className="me-2"
        />
      </div>
      <Button
        type="primary"
        loading={loading}
        disabled={!isEdited}
        htmlType="submit"
      >
        تعديل
      </Button>
    </form>
  );
}
