require("dotenv").config();
const express = require("express");
const app = express(); 

const serverTelegramClient = require("./server-telegram-client.js");
serverTelegramClient.init();

const telegram = require('./routes/telegram')
const webhooks = require('./routes/webhooks')

app.use('/telegram', telegram);
app.use('/webhooks', webhooks);

app.get("/health", (req, res) => {
  res.send("Healthy!");
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
