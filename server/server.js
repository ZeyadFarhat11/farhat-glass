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
    console.log("\x1b[32m%s\x1b[0m", "DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log("\x1b[31m%s\x1b[0m", "DATABASE CONNECTION ERROR");
    console.log(err);
  });

const port = process.env.PORT || 8000;

const server = app.listen(port, "0.0.0.0", () => {
  console.log("\x1b[33m%s\x1b[0m", "SERVER STARTED");
  console.log(`Local: http://localhost:${port}`);
});

const setStats = async () => {
  const stats = await getHomeStats();
  app.set("home-stats", stats);
};
setStats();

server.on("request", (req, res) => {
  if (req.method === "GET") return;
  res.on("finish", async () => {
    try {
      console.log("response finish");
      setStats();
    } catch (err) {
      console.log(`Cann't set home stats ❌`);
    }
  });
});

process.on("SIGINT", async () => {
  // Perform cleanup operations here
  console.log("Server shutting down...");
  // Close database connections, release resources, etc.
  await mongoose.disconnect();
  // Exit the process
  process.exit(0);
});
