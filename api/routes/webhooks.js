const express = require("express");
const fs = require("fs");

const { WEBHOOKS_FILE } = require("../constants");
const serverTelegramClient = require("../server-telegram-client");
const { getWebhooks } = require("../datastore");
const router = express.Router();

router.get("/", (req, res) => {
  const webhooks = getWebhooks();
  res.status(200).json(webhooks);
});

router.post("/", (req, res) => {
  const { url } = req.body;
  let webhooks = getWebhooks();
  const newWebhook = { url, id: new Date().getTime() };
  webhooks.push(newWebhook);
  fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify(webhooks, null, 2));
  serverTelegramClient.setWebhooks(webhooks);
  res.status(200).json(newWebhook);
});

router.delete("/:webhookId", (req, res) => {
  const { webhookId } = req.params;

  let webhooks = getWebhooks();
  webhooks = webhooks.filter((w) => w.id != webhookId);
  fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify(webhooks, null, 2));
  serverTelegramClient.setWebhooks(webhooks);
  res.status(200).json({ message: "webhook successfully deleted." });
});

module.exports = router;
