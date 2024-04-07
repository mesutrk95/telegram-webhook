require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors')

const serverTelegramClient = require("./server-telegram-client.js");
serverTelegramClient.init();

const telegram = require('./routes/telegram')
const webhooks = require('./routes/webhooks')

app.use(cors())
app.use(express.json())

app.use('/telegram', telegram);
app.use('/webhooks', webhooks);

app.get("/health", (req, res) => {
  res.status(200).send("Healthy!");
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});

// const { TelegramClient } = require("telegram");
// const { StringSession } = require("telegram/sessions");
// const input = require("input"); // npm i input
 
// const stringSession = new StringSession("1BAAOMTQ5LjE1NC4xNjcuOTEAULIIGgTGc/wzxEG9fqRO8l/tcyCAgRvPn8c6B1lkIZSPh0+4LriA06UZi++F02U3esw4Ff4A6Q19PikXC5/pSRraoB7rEHjdRDglRuJWErLUg2E4Vg+LqaKiM9jToOkPOTcwjrZMBm//6GdIdK/OwxMvbP2tD2OIfxuhxK1NTFUj3XHvu9W0fa/XnXSGp7nAyW+D+p4dgYbO5BE+3SLcbAZI1RD1hkzJnNGI0u/5QjRTTSkBNevy2bgqKIy8tKjYX3kP5koBy4DQUFMMyrc+rHFejhFDV+9Vt1BPO8rnm586QsurTQ5qOY1OTCWrJzl8iXF64LE/zvM/1oM5yd+C9Vc="); 
// console.log(stringSession);
// (async () => {
//   console.log("Loading interactive example...");
//   const client = new TelegramClient(
//     stringSession,
//     65567,
//     'ec4ac15bc82a3f124849689abb366e00',
//     {
//       connectionRetries: 5,
//     }
//   ); 
//   await client.start({
//     phoneNumber: async () => await input.text("Please enter your number: "),
//     password: async () => await input.text("Please enter your password: "),
//     phoneCode: async () =>
//       await input.text("Please enter the code you received: "),
//     onError: (err) => console.log(err),
//   });
//   console.log("You should now be connected.");
//   console.log(client.session.save()); // Save this string to avoid logging in again
//   await client.sendMessage("me", { message: "Hello!" });
// })();
