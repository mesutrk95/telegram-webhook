const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const createTelegramClient = (session) => {
  return new TelegramClient(
    new StringSession(session),
    Number(process.env.TLG_APP_ID),
    process.env.TLG_APP_HASH,
    {
      connectionRetries: 5,
    }
  );
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

module.exports = {
  createTelegramClient,
  waitFor,
  wait,
  replaceAll,
};
