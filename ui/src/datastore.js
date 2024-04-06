import fs from "fs";
import { TELEGRAM_ACCOUNT_FILE, WEBHOOKS_FILE } from "./constants";

export function getTelegramAccount() {
  if (!fs.existsSync(TELEGRAM_ACCOUNT_FILE)) {
    return null;
  }

  const accountData = fs.readFileSync(TELEGRAM_ACCOUNT_FILE, "utf-8");
  const account = JSON.parse(accountData);
  return account;
}

export function getWebhooks() {
  if (!fs.existsSync(WEBHOOKS_FILE)) {
    return [];
  }
  const webhooksStr = fs.readFileSync(WEBHOOKS_FILE, "utf-8");
  const webhooks = JSON.parse(webhooksStr);
  return webhooks;
}
