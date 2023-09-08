import Select from "react-select";
import { useMemo, useState } from "react";

export default function CalcInvoicesTotal({ invoices, active }) {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const serializedInvoices = useMemo(
    () =>
      invoices.map((inv) => ({
        label: [inv.client?.name, inv.title, inv.total].join(" - "),
        value: inv.total,
      })),
    [invoices]
  );

  const total = useMemo(
    () => selectedInvoices.map((inv) => inv.value).reduce((a, b) => a + b, 0),
    [selectedInvoices]
  );
  return (
    <div style={{ display: active ? "block" : "none" }}>
      <h4>حساب مجموع عدة فواتير</h4>

      <Select
        isMulti
        options={serializedInvoices}
        onChange={(values) => setSelectedInvoices(values)}
        placeholder="اختر الفواتير..."
      />
      <h4 className="mt-3">
        المجموع : <b className="total">{total}</b>
      </h4>
    </div>
  );
}
