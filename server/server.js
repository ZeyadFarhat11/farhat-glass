require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const setHomeStats = require("./utils/setHomeStats");

mongoose
  .connect(process.env.DATABASE_URL, {
    dbName:
      process.env.MODE === "real"
        ? process.env.DATABASE_NAME
        : process.env.DATABASE_FAKE_NAME,
  })
  .then(() => {
    console.log(`DATABASE CONNECTED ✅`);
    setHomeStatsInterval();
  })
  .catch((err) => {
    console.log(`DATABASE CONNECTION ERROR ❌`);
    console.log(err);
  });

const setHomeStatsInterval = () => {
  setHomeStats();
  setInterval(setHomeStats, 10000);
};

const port = process.env.PORT || 8000;

app.listen(port, "0.0.0.0", () => {
  console.log(`SERVER STARTED - PORT: ${port}`);
});
