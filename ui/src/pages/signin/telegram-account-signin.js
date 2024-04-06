import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

console.log(process.env.NEXT_PUBLIC_TLG_APP_ID, process.env.NEXT_PUBLIC_TLG_APP_HASH);

export function createTelegramClient(session) {
  return new TelegramClient(
    session,
    Number(process.env.NEXT_PUBLIC_TLG_APP_ID),
    process.env.NEXT_PUBLIC_TLG_APP_HASH,
    {
      connectionRetries: 5,
    }
  );
}

export default class TelegramAccountSingIn {
  status = "none";

  async start(phone) {
    this.phone = phone;
    console.log('start with ', phone);
    this.client = createTelegramClient(new StringSession(""));
    await this.client.start({
      phoneNumber: () => phone,
      phoneCode: () => {
        console.log(`[accounts](${this.phone}) Code request`, typeof this);
        this.status = "code-sent";
        return new Promise((resolve) => {
          console.log(`[accounts](${this.phone}) setCode applied`, typeof this);
          this.setCode = resolve;
        });
      },
      password: () => {
        console.log(`[accounts](${this.phone}) Password request`);
        this.status = "password-request";
        return new Promise((resolve) => {
          console.log(
            `[accounts](${this.phone}) setPassword applied`,
            typeof this
          );
          this.setPassword = resolve;
        });
      },
      onError: (error) => {
        this.status = "error";
        this.error = error;
        console.log("telegram client error!", error);
      },
    });

    console.log(`[accounts](${this.phone}) Account activated`);
    this.status = "active";
  }

  getPassword(viaApp) {
    this.status = "password-request";
    console.log(
      `[accounts](${this.phone}) Password request ${viaApp ? "(Via App)" : ""}`
    );
    return new Promise((resolve) => {
      this.setPassword = resolve;
    });
  }

  getPhoneCode() {
    this.status = "code-sent";
    console.log(`[accounts](${this.phone}) Code request`);
    return new Promise((resolve) => {
      this.setCode = resolve;
    });
  }

  getSession() {
    const result = this.client.session.save();
    console.log(`[accounts](${this.phone}) Session save, session=${result}`);
    return result;
  }
}
