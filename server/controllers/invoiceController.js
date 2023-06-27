const fs = require("fs");
const PDF = require("pdfkit");
const puppeteer = require("puppeteer");
const catchAsync = require("../utils/catchAsync");
const Invoice = require("../models/invoiceModel");
// const getInvoiceDate = require("../utils/getInvoiceDate");
// const calcInvoiceTotal = require("../utils/calcInvoiceTotal");

const calcInvoiceTotal = (rows) =>
  rows.map((row) => +row.at(-1)).reduce((a, b) => a + b, 0);

const getInvoiceDate = (d) => {
  const date = new Date(d);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("ar-EG", options).replace(/\u200E/g, "");
};

const generateRandomNumber = () => {
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  return randomNumber.toString();
};

// const templateInvoice = fs.readFileSync(
//   `${__dirname}/../assets/imgs/template-invoice.png`
// );

// exports.createInvoice = (req, res) => {
//   const { rows, client, date } = req.body;
//   if (!rows?.length) {
//     res.send("Invalid rows");
//     return;
//   }
//   const doc = new PDF({ bufferPages: true, autoFirstPage: false });

//   const docNumber = Math.floor(Math.random() * 1000000);
//   const filename = `${docNumber} ${client || ""}.pdf`;
//   const docPath = `${__dirname}/invoices/${filename}`;

//   doc.addPage({ size: [595, 767], margin: 0 });
//   doc.image(templateInvoice, { fit: [595, 767] });

//   // doc id
//   doc.fontSize(12);
//   doc.fillColor("#ffd6d6");
//   doc.text("H" + docNumber, 40, 135, { width: 128, align: "center" });

//   doc.fontSize(13);
//   doc.fillColor("#000");

//   doc.font(`${__dirname}/fonts/Almarai-Regular.ttf`);
//   // client name
//   if (client) {
//     doc.text(client.split(" ").reverse().join(" "), 295, 159, {
//       width: 195,
//       align: "right",
//       wordSpacing: 1,
//     });
//   }

//   // date
//   const invoiceDate = getDate(date).reverse();
//   doc.text(invoiceDate, 295, 132, {
//     width: 195,
//     align: "right",
//     characterSpacing: 1,
//   });

//   rows.forEach((row, i) => {
//     // id
//     doc.text(i + 1, 509, 260 + i * 30, { width: 46, align: "center" });

//     // title
//     const title = row[0].split(" ").reverse().join(" ");
//     doc.text(title, 338, 260 + i * 30, {
//       width: 171,
//       align: "center",
//       wordSpacing: 1,
//     });

//     // qty
//     doc.text(row[1], 245, 260 + i * 30, {
//       width: 93,
//       align: "center",
//     });

//     // price
//     doc.text(row[2], 153, 260 + i * 30, {
//       width: 92,
//       align: "center",
//       characterSpacing: 0.5,
//     });

//     // total
//     doc.text(row[3], 40, 260 + i * 30, {
//       width: 113,
//       align: "center",
//       characterSpacing: 0.5,
//     });
//   });

//   const invoiceTotal =
//     req.body.invoiceTotal || rows.map((e) => e[3]).reduce((a, b) => +a + +b, 0);
//   if (invoiceTotal) {
//     doc.font(`${__dirname}/fonts/Almarai-Bold.ttf`);
//     doc.fontSize(16);
//     doc.text(invoiceTotal.toLocaleString("en-US"), 77, 688, {
//       width: 247,
//       align: "center",
//       characterSpacing: 1,
//     });
//   }

//   doc.pipe(fs.createWriteStream(docPath)).on("finish", () => {
//     res.status(200).json({ filename });
//     // res.download(docPath);
//   });

//   doc.end();
// };

exports.createInvoice = catchAsync(async (req, res) => {
  const { rows = [], client, date, "invoice-total": invoiceTotal } = req.body;

  if (!rows.length) {
    res.status(400).json({ message: "rows are required" });
    return;
  }
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 773 });
  await page.goto("http://localhost:8000/template-invoice.html");
  const invoiceDateEn = date || Date.now();
  const invoiceDate = getInvoiceDate(invoiceDateEn);
  const randomNumber = generateRandomNumber();
  await page.evaluate(
    (rows, client, date, invoiceTotal, id) => {
      insertRows(rows);
      fillRows();
      if (client) {
        setClient(client);
      }
      setDate(date);
      setInvoiceTotal(invoiceTotal);
      setInvoiceID(id);
    },
    rows,
    client,
    invoiceDate,
    invoiceTotal || calcInvoiceTotal(rows),
    `H${randomNumber}`
  );
  const filename = `${randomNumber} ${client} ${rows.length}.pdf`;
  const filepath = `${__dirname}/../assets/invoices/${filename}`;
  await page.pdf({ path: filepath });
  await browser.close();

  try {
    await Invoice.create({
      client,
      filename,
      filepath,
      invoice_date: invoiceDateEn,
    });
  } catch (err) {
    console.log(err);
  }
  if (req.headers["postman-token"]) {
    res.download(filepath);
    return;
  }
  res.status(200).json({ filepath, filename });
});

exports.getInvoice = (req, res) => {
  const { path } = req.params;
  res.download(`${__dirname}/invoices/${path}`);
};
