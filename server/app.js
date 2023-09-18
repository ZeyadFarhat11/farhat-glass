const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const checkAdmin = require("./middleware/checkAdmin");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
}

app.use(
  "/api/v1",
  require("./routers/utilRouter"),
  require("./routers/messageRouter"),
  checkAdmin,
  require("./routers/clientRouter"),
  require("./routers/invoiceRouter"),
  require("./routers/workRouter"),
  require("./routers/galleryRouter")
);

app.use("/api/v1", (_, res) => {
  res.status(404).json("Invalid route!");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client")));
  app.use((_, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
  });
}
module.exports = app;
