const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/assets`));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/invoice", require("./routers/invoiceRouter"));
app.use("/api/v1/clients", require("./routers/clientRouter"));

module.exports = app;
