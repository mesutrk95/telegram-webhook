const fs = require("fs");
const { TELEGRAM_ACCOUNT_FILE, WEBHOOKS_FILE } = require("./constants.js");

module.exports = {
  getTelegramAccount() {
    if (!fs.existsSync(TELEGRAM_ACCOUNT_FILE)) {
      return null;
    }

    const accountData = fs.readFileSync(TELEGRAM_ACCOUNT_FILE, "utf-8");
    const account = JSON.parse(accountData);
    return account;
  },

  getWebhooks() {
    if (!fs.existsSync(WEBHOOKS_FILE)) {
      return [];
    }
    const webhooksStr = fs.readFileSync(WEBHOOKS_FILE, "utf-8");
    const webhooks = JSON.parse(webhooksStr);
    return webhooks;
  },
};
