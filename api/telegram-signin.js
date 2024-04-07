const { createTelegramClient } = require("./utils");

class TelegramSingIn {
  status = "none";

  async signIn(phone) {
    this.destroy()
    this.phone = phone;
    console.log("start with ", phone);
    this.client = createTelegramClient("");
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
  async destroy() {
    this.client?.destroy();
    this.client = null;
  }
}

const telegramSignIn = new TelegramSingIn();
module.exports = telegramSignIn;
