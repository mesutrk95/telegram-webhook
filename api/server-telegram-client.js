const axios = require("axios");
const { TelegramClient, Api } = require("telegram");
const { NewMessage } = require("telegram/events");
const { StringSession } = require("telegram/sessions");
const { getTelegramAccount, getWebhooks } = require("./datastore");
const { PromisedWebSockets } = require("telegram/extensions");
const { createTelegramClient, truncateCenter, replaceAll } = require("./utils");
const fs = require("fs");

class ServerTelegramClient {
  status = "none";
  webhooks = [];
  initiated = false;

  async init() {
    if (this.initiated) {
      console.log("[tlg-client] client already initiated.");
      return;
    }
    console.log("[tlg-client] client initiating ...");
    this.webhooks = getWebhooks();
    const tlgAccount = getTelegramAccount();
    this.setSession(tlgAccount?.session);
    this.setWebhooks(this.webhooks);
    this.initiated = true;
    console.log("[tlg-client] client initiated.");
    this.reconnect();
  }

  async loadCache() {}
  async getChat(id) {
    const result = await this.tlg.invoke(
      new Api.messages.GetChats({
        id: [BigInt(id)],
      })
    );
    return result;
  }

  async fetchChats() {
    const result = await this.tlg.invoke(
      new Api.messages.GetDialogs({
        // offsetId: 0,
        // offsetDate: 43,
        // offsetId: 43,
        offsetPeer: "me",
        limit: 100,
        // excludePinned: false,
      })
    );

    // console.log(result);
    // fs.writeFileSync(
    //   `./cache/chats_${new Date().getTime()}.json`,
    //   JSON.stringify(result, null, 2)
    // );
    return result;
  }

  setWebhooks(webhooks) {
    this.webhooks = webhooks;
    console.log(
      `[tlg-client] webhooks updated, total: ${this.webhooks.length}`
    );
    this.reconnect();
  }

  setSession(session) {
    this.session = session;
    console.log(
      `[tlg-client] session updated to: ${truncateCenter(this.session, 20)}`
    );
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

  async getMessageBody(msg) {
    const className = msg.peerId?.className;
    let body = {
      message: msg.message,
      username: msg.chat?.username,
      title: msg.chat?.title
    };
    if (className === "PeerChannel") {
      body = {
        ...body,
        chatType: "channel", 
        peerId: msg.peerId.channelId,
      };
    } else if (className === "PeerChat") {
      body = {
        ...body,
        chatType: "group", 
        peerId: msg.peerId.chatId,
      };
    } else if (className === "PeerUser") {
      body = {
        ...body,
        chatType: "user",
        peerId: msg.peerId.userId,
      };
    }
    return body;
  }

  async onMessage(event) {
    // console.log(event);
    const { message } = event;
    // fs.writeFileSync(
    //   `./cache/event_${new Date().getTime()}.json`,
    //   JSON.stringify({message, chat: message.chat}, null, 2)
    // );
    if (message) {
      for (const { url } of this.webhooks) {
        const msg = await this.getMessageBody(message);
        axios
          .post(url, msg)
          .then(() => {
            console.log(
              `[webhook] called, code: 200, url: ${url}, msg: ${replaceAll(
                truncateCenter(msg.message, 20),
                "\n",
                ""
              )}`
            );
          })
          .catch(({ response }) => {
            console.log(
              `[webhook] call failed, code: ${response?.status}, url: ${url}`
            );
          });
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
    if (!this.initiated) return false;
    if (this.tlg) {
      await this.tlg.destroy();
      this.tlg = null;
      this.tlg.removeEventHandler(this.onMessage);
    }

    if (!this.session) return;

    const tlg = (this.tlg = createTelegramClient(this.session));
    // tlg.setLogLevel("debug")
    await tlg.connect();
    this.status = "connected";

    this.profile = await tlg.getMe().originalArgs;

    // await this.fetchChats();
    this.tlg.addEventHandler((e) => this.onMessage(e), new NewMessage({}));
  }
}

const serverTelegramClient = new ServerTelegramClient();
module.exports = serverTelegramClient;
