#!/usr/bin/env node
const { program } = require("commander");
const path = require("path");
const { exit } = require("process");

program
  .version("1.0.0")
  .description(
    "Telegram Webhooks - Receive your telegram account messages in your end easily!"
  )
  .arguments("<directory>")
  .option('--port <id>', "Webhooks server port default 3223")
  .option('--tlg-app-id <id>', "Telegram App Id")
  .option('--tlg-app-hash <id>', "Telegram App Hash")
  .parse(process.argv);

program.parse();
const options = program.opts();
console.log(options);
// Check if a directory argument is provided
if (!program.args.length) {
  console.error("Error: please provide the path to the directory.");
  program.help();
}

function getProjectConfigPath() {
  const directory = program.args[0];
  const target = path.resolve(directory);
  const configFile = path.join(target, "tlg-webhooks.config");
  return configFile;
}

const configFile = getProjectConfigPath();
console.log("loading config from", configFile);
const config = require(configFile);
const Config = require("./api/config");

const port = options.port || config?.api?.port || 3223

Config.set("PORT", port);
const server = require("./api/server")();

process.on("SIGINT", async () => {
  console.log("\nclosing watchers ...");
  console.log("bye!");
  exit(0);
});
