require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const getHomeStats = require("./utils/getHomeStats");

mongoose
  .connect(process.env.DATABASE_URL, {
    dbName:
      process.env.MODE === "real"
        ? process.env.DATABASE_NAME
        : process.env.DATABASE_FAKE_NAME,
  })
  .then(() => {
    console.log(`DATABASE CONNECTED ✅`);
  })
  .catch((err) => {
    console.log(`DATABASE CONNECTION ERROR ❌`);
    console.log(err);
  });

const port = process.env.PORT || 8000;

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`SERVER STARTED
  Local: http://localhost:${port}`);
});

const setStats = async () => {
  const stats = await getHomeStats();
  app.set("home-stats", stats);
};
setStats();

server.on("request", (req, res) => {
  if (req.method === "GET") return;
  res.on("finish", async () => {
    console.log("response finish");
    setStats();
  });
});
