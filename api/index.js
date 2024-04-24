require("dotenv").config();
const Config = require("config");

Config.set("PORT", process.env.PORT);
Config.set("TLG_APP_ID", process.env.TLG_APP_ID);
Config.set("TLG_APP_HASH", process.env.TLG_APP_HASH);

require("./server")();
