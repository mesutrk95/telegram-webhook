const axios = require("axios");
const { TelegramClient } = require("telegram");
const { NewMessage } = require("telegram/events");
const { StringSession } = require("telegram/sessions");
const { getTelegramAccount, getWebhooks } = require("./datastore");
const { PromisedWebSockets } = require("telegram/extensions");
const { createTelegramClient } = require("./utils");

class ServerTelegramClient {
  status = "none";
  webhooks = [];
  inited = false;

  init() {
    if (this.inited) {
      console.log("telegram server already inited.");
      return;
    }
    console.log("telegram server initiating ...");
    this.webhooks = getWebhooks();
    const tlgAccount = getTelegramAccount();
    this.session = tlgAccount?.session;
    console.log("telegram server inited", this.webhooks, this.session);
    this.inited = true;
    this.reconnect();
  }

  setWebhooks(webhooks) {
    this.webhooks = webhooks;
    this.reconnect();
  }

  setSession(session) {
    this.session = session;
    this.reconnect();
  }

  async resolveUsername(username) {
    const resolvedUsername = await this.tlg.resolveUsername(username);
    const { chats } = resolvedUsername.originalArgs;
    if (chats.length > 0) {
      console.log("dialog resolved", username);
      return { id: chats[0].id.toJSNumber(), username };
    }
  }

  async onMessage(event) {
    // console.log(event);
    const { message } = event;
    if (message) {
      for (const { url } of this.webhooks) {
        console.log("webhook called", url, message.text);
        axios
          .post(url, { message: message.text })
          .then(() => {})
          .catch((err) => {});
      }

      // const dialog = dialogs.find(
      //   (d) =>
      //     d.id === message.chatId.toJSNumber() ||
      //     message.peerId?.channelId?.toJSNumber() === d.id
      // );
      // if (dialog) {
      //   dialog.message = message;
      //   console.log("found", message, event);
      // } else {
      // }
    }
  }

  async reconnect() {
    if (this.tlg) {
      await this.tlg.destroy();
      this.tlg = null;
    }
    if (!this.session) return;

    const tlg = (this.tlg = createTelegramClient(this.session));
    // tlg.setLogLevel("debug")
    await tlg.connect();
    this.status = "connected";

    this.profile = await tlg.getMe().originalArgs;

    this.tlg.addEventHandler((e) => this.onMessage(e), new NewMessage({}));
    return () => {
      this.tlg.removeEventHandler(this.onMessage);
    };
  }
}

const serverTelegramClient = new ServerTelegramClient();
module.exports = serverTelegramClient;
