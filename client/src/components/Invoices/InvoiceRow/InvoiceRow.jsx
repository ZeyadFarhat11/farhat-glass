import {
  faAngleDown,
  faAngleUp,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, InputNumber } from "antd";
import { generateRandomNumber } from "../../../utils";
import "./invoice-row.scss";

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

  const changeRowOrder = (direction, id) => {
    const index = rows.findIndex((e) => e.id === id);
    if (direction === "up" && index !== 0) {
      [rows[index], rows[index - 1]] = [rows[index - 1], rows[index]];
      setRows([...rows]);
    } else if (direction === "down" && index !== rows.length - 1) {
      [rows[index], rows[index + 1]] = [rows[index + 1], rows[index]];
      setRows([...rows]);
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
        {qtyUnits?.map((unit, i) => (
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
        <button className="delete" onClick={deleteRow} type="button">
          <FontAwesomeIcon icon={faMinusCircle} />
        </button>
        <button onClick={() => changeRowOrder("up", id)} type="button">
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
        <button onClick={() => changeRowOrder("down", id)} type="button">
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
      </div>
    </div>
  );
}

export default InvoiceRow;
