const axios = require("axios");
const { TelegramClient } = require("telegram");
const { NewMessage } = require("telegram/events");
const { StringSession } = require("telegram/sessions");
const { getTelegramAccount, getWebhooks } = require("./datastore");

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

  createClient(session) {
    return new TelegramClient(
      new StringSession(session),
      Number(process.env.TLG_APP_ID),
      process.env.TLG_APP_HASH,
      {
        connectionRetries: 5,
      }
    );
  }

  setWebhooks(webhooks) {
    this.webhooks = webhooks;
    this.reconnect();
  }

  setSession(session) {
    console.log("sesioooooooooon", session);
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
        try {
          console.log("webhook called", url, message.text);
          axios.post(url, { message: message.text });
        } catch (error) {
          console.log(error);
        }
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

    const tlg = (this.tlg = this.createClient(this.session));
    await tlg.connect();
    this.status = "connected";

    this.profile = await tlg.getMe().originalArgs;

    client.client.addEventHandler((e) => this.onMessage(e), new NewMessage({}));
    return () => {
      client.client.removeEventHandler(this.onMessage);
    };
  }
}

const serverTelegramClient = new ServerTelegramClient();
module.exports = serverTelegramClient;
