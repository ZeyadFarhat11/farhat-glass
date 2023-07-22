import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, InputNumber } from "antd";
import { generateRandomNumber } from "../../utils";

function InvoiceRow({
  title,
  price,
  qty,
  total,
  id,
  setRows,
  rows,
  qtyUnit,
  qtyUnits,
}) {
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
      qtyUnit: "",
      total: "",
      id: generateRandomNumber(),
    };
    rows.splice(currentRowIndex + 1, 0, newRow);
    setRows([...rows]);
  };

  const calcRowTotal = ({ qty, price }) => {
    if (qty && price) {
      try {
        let total = qty * price;

        setRows((prevRows) =>
          prevRows.map((row) => {
            if (row.id === id) {
              return { ...row, total };
            }
            return row;
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="row-control">
      <Input
        type="text"
        placeholder="الصنف"
        name="title"
        defaultValue={title}
        onChange={(e) => handleChange("title", e.target.value)}
        list="title-suggestions"
      />
      <Input
        type="text"
        name="qty"
        placeholder="الكمية"
        defaultValue={qty}
        onChange={(e) => {
          handleChange("qty", e.target.value);
          calcRowTotal({ qty: e.target.value, price });
        }}
      />
      <select
        value={qtyUnit}
        onChange={(e) => handleChange("qtyUnit", e.target.value)}
        className="qty-unit"
      >
        <option value="">الوحدة</option>
        {qtyUnits.map((unit, i) => (
          <option value={unit} key={i}>
            {unit}
          </option>
        ))}
      </select>
      <InputNumber
        name="price"
        maxLength={6}
        placeholder="السعر"
        onChange={(value) => {
          handleChange("price", value);
          calcRowTotal({ price: value, qty });
        }}
        defaultValue={price}
      />
      <InputNumber
        maxLength={10}
        name="total"
        placeholder="الاجمالي"
        onChange={(value) => handleChange("total", value)}
        value={total}
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

export default InvoiceRow;
