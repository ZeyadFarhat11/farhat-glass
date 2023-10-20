const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const checkAdmin = require("./middleware/checkAdmin");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
}
app.options("*", cors());
const limiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 30,
  message:
    "Too many accounts created from this IP, please try again after an hour!",
});
app.use("/api/*", limiter);
app.use(xss());
app.use(mongoSanitize());

app.use(
  "/api/v1",
  require("./routers/utilRouter"),
  require("./routers/messageRouter"),
  require("./routers/galleryRouter"),
  checkAdmin,
  require("./routers/clientRouter"),
  require("./routers/invoiceRouter"),
  (_, res) => {
    res.status(404).json("Invalid route!");
  }
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client")));
  app.use((_, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
  });
}
module.exports = app;
