const { mkdirSafe } = require("./utils.js");
const express = require("express");
const cors = require("cors");
const Config = require("./config");
const telegram = require("./routes/telegram");
const webhooks = require("./routes/webhooks");

const serverTelegramClient = require("./server-telegram-client.js");

module.exports = () => {
  const app = express();

  mkdirSafe("./cache");
  mkdirSafe("./data");

  app.use(cors());
  app.use(express.json());
  app.use("/telegram", telegram);
  app.use("/webhooks", webhooks);

  app.get("/health", (req, res) => {
    res.status(200).send("Healthy!");
  });

  serverTelegramClient.init();

  app.listen(Config.get('PORT'), () => {
    console.log(`API listening on port ${Config.get('PORT')}`);
  });
};
