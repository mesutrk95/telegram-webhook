const program = require("commander");
const Indexer = require("./dist").default;
const path = require("path");
const { exit } = require("process");

program
  .version("1.0.0")
  .description(
    "Telegram Webhooks - Receive your telegram acount messages in your end easily!"
  )
  .arguments("<directory>")
  .parse(process.argv);

program.parse();
const options = program.opts();

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
const server = require("./api/server")(config?.api?.port || 3223);

process.on("SIGINT", async () => {
  console.log("\nclosing watchers ...");
  await indexer.destroy();
  console.log("bye!");
  exit(0);
});
