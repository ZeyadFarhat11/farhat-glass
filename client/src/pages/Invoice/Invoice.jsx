import { useEffect, useState } from "react";
import api from "../../utils/api";
import "./invoice.scss";
import { useParams } from "react-router-dom";
import logo from "../../assets/images/invoice-logo.svg";
import info from "../../assets/images/invoice-info.svg";
import dayjs from "dayjs";
import { Button } from "antd";
import { Helmet } from "react-helmet";
import convertToArabicDate from "../../utils/convertToArabicDate";

export default function Invoice() {
  const { invoice, loading } = useGetInvoice();
  if (loading) return "جار التحميل...";

  const date = convertToArabicDate(dayjs(invoice.date).format("DD-MM-YYYY"));
  return (
    <>
      <Helmet>
        <title>
          فرحات للزجاج والسيكوريت | فاتورة {invoice.client.name} |{" "}
          {invoice.title}
        </title>
      </Helmet>
      <Button onClick={window.print} id="export-pdf" htmlType="button">
        تصدير pdf
      </Button>
      <div className="invoice">
        <div className="header-wrapper">
          <img src={logo} alt="logo" />
          <img src={info} alt="info" />
        </div>
        <div className="info">
          <div className="client">
            <span>العميل : </span>
            <span>{invoice.client.name}</span>
          </div>
          <div className="date">
            <span>التاريخ : </span>
            <span>{date}</span>
          </div>
        </div>

        <div class="invoice-table">
          <div class="head">
            <span>م</span>
            <span>الصنف</span>
            <span>الكمية</span>
            <span>السعر</span>
            <span>الاجمالي</span>
          </div>
          <div class="body">
            {invoice.rows.map((row, i) => (
              <div class="invoice-row">
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
              .map(() => (
                <div class="invoice-row empty">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ))}
          </div>
          <div class="invoice-total">
            <span>اجمالي الفاتورة</span>
            <span class="value">{invoice.total.toLocaleString("en-US")}</span>
          </div>
        </div>

        <p class="footer">
          العنوان : السنانية - الشيخ سديد - بجوار الهندي للأسمنت ت : ٠١٠٠٨٩١٧٨١٩
        </p>
      </div>
    </>
  );
}

function useGetInvoice() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState();
  const [loading, setLoading] = useState(true);
  const loadInvoice = async () => {
    try {
      const res = await api.get(`/invoices/${invoiceId}`, {
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
