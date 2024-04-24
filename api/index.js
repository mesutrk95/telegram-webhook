require("dotenv").config();
const { mkdirSafe } = require("./utils.js");

const express = require("express");
const app = express();
const cors = require("cors");

const serverTelegramClient = require("./server-telegram-client.js");

const telegram = require("./routes/telegram");
const webhooks = require("./routes/webhooks");

mkdirSafe("./cache");
mkdirSafe("./data");

serverTelegramClient.init();

app.use(cors());
app.use(express.json());

const router = express.Router();
router.use("/telegram", telegram);
router.use("/webhooks", webhooks);
app.use(process.env.API_BASE_URL || "/", router);

app.get("/health", (req, res) => {
  res.status(200).send("Healthy!");
});

app.listen(process.env.API_PORT, () => {
  console.log(`API listening on port ${process.env.API_PORT}`);
});
