const express = require("express");
const fs = require("fs");

const { TELEGRAM_ACCOUNT_FILE } = require("../constants");
const serverTelegramClient = require("../server-telegram-client");
const { getTelegramAccount } = require("../datastore");
const router = express.Router();

router.get("/session", (req, res) => {
  const account = getTelegramAccount();
  if (!account) {
    return res.status(404).json({ message: "no account found." });
  }
  serverTelegramClient.init();
  res.status(200).json(account);
});

router.post("/session", (req, res) => {
  const { session, phone } = req.body;
  fs.writeFileSync(TELEGRAM_ACCOUNT_FILE, JSON.stringify({ session, phone }));
  serverTelegramClient.setSession(session);
  res.status(200).json({ message: "session successfully saved." });
});

router.delete("/session", (req, res) => {
  if (fs.existsSync(TELEGRAM_ACCOUNT_FILE)) {
    fs.rmSync(TELEGRAM_ACCOUNT_FILE);
  }
  serverTelegramClient.setSession(null);
  res.status(200).json({ message: "session signed out." });
});

module.exports = router;
