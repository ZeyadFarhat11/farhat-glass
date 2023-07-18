const path = require("node:path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const db = require("./DB/db");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.static(`${__dirname}/assets`));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/invoices", require("./routers/invoiceRouter"));
app.use("/api/v1/clients", require("./routers/clientRouter"));
app.use("/api/v1/home", async (req, res) => {
  const clients = await db.clients.findPro({});
  const invoicesCount = await db.invoices.countPro({});
  const remainingDebt = clients
    .map((client) => client.debt)
    .reduce((a, b) => a + b, 0);
  res.json({
    clientsCount: clients.length,
    invoicesCount,
    remainingDebt,
  });
});

app.use(express.static(path.join(__dirname, "../client/dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

module.exports = app;
