require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.DATABASE_URL, {
    dbName: process.env.DATABASE_NAME,
  })
  .then(() => console.log(`DATABASE CONNECTED ✅`))
  .catch(() => console.log(`DATABASE CONNECTION ERROR ❌`));

const port = process.env.PORT || 8000;

app.listen(port, "localhost", () => {
  console.log(`SERVER STARTED - PORT: ${port}`);
});
