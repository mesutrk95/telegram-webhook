const express = require("express");
const fs = require("fs");

const { TELEGRAM_ACCOUNT_FILE } = require("../constants");
const serverTelegramClient = require("../server-telegram-client");
const { getTelegramAccount } = require("../datastore");
const telegramSignIn = require("../telegram-signin");
const { waitFor } = require("../utils");
const router = express.Router();

function onSignIn({ session, phone }) {
  fs.writeFileSync(TELEGRAM_ACCOUNT_FILE, JSON.stringify({ session, phone }));
  serverTelegramClient.setSession(session);
}

router.get("/", (req, res) => {
  const account = getTelegramAccount();
  if (!account) {
    return res.status(404).json({ message: "no account found." });
  }
  // serverTelegramClient.init();
  res.status(200).json(account);
});

router.post("/requestCode", async (req, res) => {
  const { phone } = req.body;
  telegramSignIn.signIn(phone);
  await waitFor(() => telegramSignIn.status !== "none" || telegramSignIn.error);

  if (!telegramSignIn.error) {
    res.json({ message: `Code sent to ${phone}`, status: "code-sent" });
  } else {
    res.status(400).json({
      message: `Error requesting code for ${phone}, error: ${telegramSignIn.error.toString()}`,
      status: "error",
    });
  }
});

router.post("/setCode", async (req, res) => {
  const { code } = req.body;
  telegramSignIn.setCode(code);

  await waitFor(() => telegramSignIn.status != "code-sent");

  if (telegramSignIn.status === "password-request") {
    res.json({
      message: `Account ${telegramSignIn.phone} requires password!`,
      status: "password-request",
    });
  } else if (telegramSignIn.status === "active") {
    const account = {
      phone: telegramSignIn.phone,
      session: await telegramSignIn.getSession(),
    };
    onSignIn(account);

    res.json({
      message: `Account ${telegramSignIn.phone} successfully signed in!`,
      status: "active",
      account,
    });
    await telegramSignIn.destroy();
  } else {
    res.status(400).json({
      message: `Error (${telegramSignIn.phone}): ${telegramSignIn.error.toString()}`,
      status: "error",
    });
  }
});
router.post("/setPassword", async (req, res) => {
  const { password } = req.body;
  telegramSignIn.setPassword(password);
  await waitFor(() => telegramSignIn.status != "password-request");

  if (telegramSignIn.status === "active") {
    const account = {
      phone: telegramSignIn.phone,
      session: await telegramSignIn.getSession(),
    };
    onSignIn(account);
    res.json({
      message: `Account ${telegramSignIn.phone} successfully signed in!`,
      status: "active",
      account,
    });
    await telegramSignIn.destroy();
  } else {
    console.error(telegramSignIn.error);
    toast.error(`Error ${telegramSignIn.phone}: ${telegramSignIn.error.toString()}`);
  }
});

router.post("/signOut", (req, res) => {
  if (fs.existsSync(TELEGRAM_ACCOUNT_FILE)) {
    fs.rmSync(TELEGRAM_ACCOUNT_FILE);
  }
  serverTelegramClient.setSession(null);
  res.status(200).json({ message: "session signed out." });
});

module.exports = router;
