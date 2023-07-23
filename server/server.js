require("dotenv").config();

// const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(
    "mongodb+srv://zeyad:pY8EmWdCVi6CsJwN@cluster2.1lyouxs.mongodb.net/?retryWrites=true&w=majority",
    {
      dbName: "farhat",
    }
  )
  .then(() => console.log(`DATABASE CONNECTED ✅`))
  .catch((err) => {
    console.log(`DATABASE CONNECTION ERROR ❌`);
    console.log(err);
  });

const port = process.env.PORT || 8000;

app.listen(port, "0.0.0.0", () => {
  console.log(`SERVER STARTED - PORT: ${port}`);
});
