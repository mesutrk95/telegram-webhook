const fs = require("fs");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const Config = require("./config");

const createTelegramClient = (session) => {
  const tlg = new TelegramClient(
    new StringSession(session),
    Number(Config.get("TLG_APP_ID")),
    Config.get("TLG_APP_HASH"),
    {
      connectionRetries: 5,
    }
  );
  return tlg;
};

const wait = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay || 500);
  });
};

const waitFor = (condition) => {
  return new Promise(async (resolve) => {
    while (!condition()) {
      await wait();
    }
    resolve();
  });
};

const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, "g"), replace);
};

const mkdirSafe = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};
const truncate = (str, max) => {
  if (str.length > max) {
    return str.substring(0, max) + "...";
  } else {
    return str;
  }
};

const truncateCenter = (str, max) => {
  if (!str) return "";
  if (str.length > max) {
    const half = Math.floor(max / 2);
    return (
      str.substring(0, half) +
      "..." +
      str.substring(str.length - 1 - half, str.length - 1)
    );
  } else {
    return str;
  }
};

module.exports = {
  createTelegramClient,
  waitFor,
  wait,
  replaceAll,
  mkdirSafe,
  truncate,
  truncateCenter,
};
