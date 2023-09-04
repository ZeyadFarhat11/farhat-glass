const { networkInterfaces } = require("os");

const nets = networkInterfaces();

console.log(nets["Wi-Fi"].at(-1).address);
