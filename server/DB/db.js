const path = require("node:path");
// const { promisify } = require("node:util");
const Datastore = require("nedb");
const db = {
  clients: new Datastore({
    filename: path.join(__dirname, "clients.txt"),
    autoload: true,
  }),
  invoices: new Datastore({
    filename: path.join(__dirname, "invoices.txt"),
    autoload: true,
  }),
};

const promisify = (method) =>
  function (...params) {
    return new Promise((res, rej) => {
      this[method](...params, (err, ...results) => {
        if (err) return rej(err);
        return res(results.length > 1 ? results : results[0]);
      });
    });
  };
db.clients.findOnePro = promisify("findOne");
db.invoices.findOnePro = promisify("findOne");
db.clients.findPro = promisify("find");
db.invoices.findPro = promisify("find");
db.clients.insertPro = promisify("insert");
db.invoices.insertPro = promisify("insert");
db.clients.deletePro = promisify("remove");
db.invoices.deletePro = promisify("remove");
db.clients.updatePro = promisify("update");
db.invoices.updatePro = promisify("update");

module.exports = db;
