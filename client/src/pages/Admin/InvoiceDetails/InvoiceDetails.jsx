import { Button, Checkbox } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import info from "../../../assets/images/invoice-info.svg";
import logo from "../../../assets/images/invoice-logo.svg";
import api, { adminApi } from "../../../utils/api";
import convertToArabicDate from "../../../utils/convertToArabicDate";
import "./invoice-details.scss";

export default function InvoiceDetails() {
  const { invoice, loading } = useGetInvoice();
  const [titleActive, setTitleActive] = useState(false);

  useEffect(() => {
    return () => (window.document.title = "فرحات للزجاج والسيكوريت");
  }, []);

  if (loading) return "جار التحميل...";

  const toggleTitleActive = () => setTitleActive((p) => !p);
  const date = convertToArabicDate(dayjs(invoice.date).format("DD-MM-YYYY"));
  return (
    <>
      <Helmet>
        <title>
          {invoice.client
            ? `فاتورة ${invoice.client.name} | ${invoice.title}`
            : `فاتورة ${invoice.title}`}
        </title>
      </Helmet>

      <div className="invoice">
        <div className="header-wrapper">
          <img src={logo} alt="logo" />
          <img src={info} alt="info" />
        </div>
        <div className="info">
          <div className="client">
            <span>العميل : </span>
            <span>{invoice.client?.name}</span>
          </div>
          <div className="date">
            <span>التاريخ : </span>
            <span>{date}</span>
          </div>
          <div className={`title${titleActive ? "" : " hidden"}`}>
            {invoice.title}
            <Checkbox
              onChange={toggleTitleActive}
              checked={titleActive}
              className="me-2"
            />
          </div>
        </div>

        <div className="invoice-table">
          <div className="head">
            <span>م</span>
            <span>الصنف</span>
            <span>الكمية</span>
            <span>السعر</span>
            <span>الاجمالي</span>
          </div>
          <div className="body">
            {invoice.rows.map((row, i) => (
              <div className="invoice-row" key={i}>
                <span>{i + 1}</span>
                <span>{row[0]}</span>
                <span>
                  {row[1]} {row[2]}
                </span>
                <span>{row[3]}</span>
                <span>{row[4].toLocaleString("en-US")}</span>
              </div>
            ))}
            {Array(13 - invoice.rows.length)
              .fill(0)
              .map((_, i) => (
                <div className="invoice-row empty" key={i}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ))}
          </div>
          <div className="invoice-total">
            <span>اجمالي الفاتورة</span>
            <span className="value">
              {invoice.total.toLocaleString("en-US")}
            </span>
            <span>جنيه مصري</span>
          </div>
        </div>

        <p className="footer">
          العنوان : السنانية - الشيخ سديد - بجوار الهندي للأسمنت ت : ٠١٠٠٨٩١٧٨١٩
        </p>
      </div>
      <Button
        onClick={window.print}
        id="export-pdf"
        htmlType="button"
        type="primary"
      >
        تصدير pdf
      </Button>
    </>
  );
}

function useGetInvoice() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState();
  const [loading, setLoading] = useState(true);
  const loadInvoice = async () => {
    try {
      const res = await adminApi.get(`/invoices/${invoiceId}`, {
        headers: { json: "json" },
      });
      setInvoice(res.data);
    } catch (err) {
      console.log(err);
      alert("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadInvoice();
  }, []);

  return { invoice, setInvoice, loading };
}
