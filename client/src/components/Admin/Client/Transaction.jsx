import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { adminApi } from "../../../utils/api";
import { toast } from "react-toastify";

export default function Transaction({
  _id,
  type,
  date,
  amount,
  description,
  invoice,
  client,
  loadClient,
  transaction,
  setEditingTransaction,
}) {
  const deleteTransaction = async () => {
    try {
      await adminApi.delete(`/clients/${client._id}/transactions/${_id}`, {
        headers: { confirmation: prompt("رمز الامان") },
      });
      toast.success("تم حذف المعاملة بنجاح");
      loadClient();
    } catch (err) {
      console.log(err);
    }
  };
  const editTransaction = () => {
    setEditingTransaction(transaction);
  };
  return (
    <div className="transaction">
      <p>
        النوع :{" "}
        <span className={type}>
          {!!invoice && "فاتورة "}
          {type === "purchase" ? "شراء" : type === "pay" ? "دفع" : "خصم"}
        </span>
      </p>
      <p>
        التاريخ : <span>{dayjs(date).format("YYYY-MM-DD")}</span>
      </p>
      <p>
        القيمة : <span>{amount}</span>
      </p>
      {description ? (
        <p>
          الوصف : <span>{description}</span>
        </p>
      ) : null}
      {invoice ? (
        <p>
          الفاتورة :{" "}
          <Link to={`/admin/invoice/${invoice}`} target="_blank">
            عرض الفاتورة
          </Link>
        </p>
      ) : null}
      <button className="delete-transaction" onClick={deleteTransaction}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
      {!!description && (
        <button className="edit-transaction" onClick={editTransaction}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      )}
    </div>
  );
}
