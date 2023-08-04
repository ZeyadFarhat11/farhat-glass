const fs = require("fs");
const { JSDOM } = require("jsdom");
const dayjs = require("dayjs");
require("dayjs/locale/ar");

class InvoiceHTML {
  constructor(templatePath) {
    this.templatePath = templatePath;
    this.templateHTML = fs.readFileSync(templatePath, "utf-8");
    this.document = new JSDOM(this.templateHTML).window.document;
  }
  setClient(clientName = "") {
    this.document.querySelector(".client span:last-child").innerHTML =
      clientName;
    return this;
  }
  setDate(date = "") {
    this.document.querySelector(".date span:last-child").innerHTML = date;
    return this;
  }

  fillRows() {
    const rowsLength = this.document.querySelectorAll(".table .row").length;
    if (rowsLength >= 13) return;
    const emptyRowHTML = `<div class="row empty">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>`;
    for (let i = rowsLength; i < 13; i++) {
      this.document
        .querySelector(".table .body")
        .insertAdjacentHTML("beforeend", emptyRowHTML);
    }
    return this;
  }

  setRows(rows) {
    rows.forEach((row, idx) => {
      const lastId =
        +this.document.querySelector(".table .row:last-child span:first-child")
          ?.innerHTML || 0;
      const rowHTML = `<div class="row">
        <span>${lastId + 1}</span>
        <span>${row[0]}</span>
        <span>${row[1]} ${row[2]}</span>
        <span>${row[3]}</span>
        <span>${row[4].toLocaleString("en-US")}</span>
      </div>`;
      this.document
        .querySelector(".table .body")
        .insertAdjacentHTML("beforeend", rowHTML);
    });
    return this;
  }
  setInvoiceID(id) {
    this.document.querySelector(".invoice-id").innerHTML = id;
    return this;
  }
  setInvoiceTotal(total) {
    this.document.querySelector(".invoice-total .value").innerHTML =
      total.toLocaleString("en-US");
    return this;
  }

  fromInvoiceDocument({ rows, _id, client, invoiceDate,title, total }) {
    this.setRows(rows)
      .fillRows()
      .setClient(client?.name || "")
      .setDate(dayjs(invoiceDate).locale("ar").format("YYYY-MM-DD"))
      .setInvoiceID(_id)
      .setInvoiceTotal(total)
      .setDocumentTitle(`فاتورة ${client?.name || ""}${title ? " - " : ""}${title ? title : ""}`);
    return this;
  }
  convertDate(d) {
    const date = new Date(d);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options).replace(/\u200E/g, "");
  }
  getHTML() {
    return this.document.documentElement.outerHTML;
  }
  setDocumentTitle(title) {
    this.document.title = title;
    return this;
  }
}

module.exports = InvoiceHTML;
