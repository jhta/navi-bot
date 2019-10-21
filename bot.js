require("dotenv").config();

const { Botkit } = require("botkit");

const fetchCommandsFromCms = require("./cms");
const createSlackAdapter = require("./slack-adapter");
const config = require("./config");

const Skills = require("./skills");
const cms = require("./skills/cms");

const Storage = require("./storage");

// const loadRoutes = require("./routes");

const adapter = createSlackAdapter(config);

const controller = new Botkit({
  webhook_uri: "/slack/receive",
  json_file_store: "./db_slackbutton_slash_command/",
  adapter: adapter,
  debug: process.env.NODE_ENV !== "production"
});

let storage = new Storage();

// loadRoutes(controller);

controller.ready(async () => {
  // load routes
  // controller.loadModules(__dirname + "/routes");

  const commands = await fetchCommandsFromCms();
  storage.setCommands(commands);

  await Skills.help(controller, { storage });
  Skills.hello(controller);
  await cms(controller, { storage });
});

function findDiff(str1, str2) {
  const s1 = JSON.stringify(str1);
  const s2 = JSON.stringify(str2);
  let diff = "";
  s2.split("").forEach((val, i) => {
    if (val != s1.charAt(i)) diff += val;
  });
  return diff;
}

controller.hears("update_cms", "direct_message", async (bot, message) => {
  try {
    const oldCommands = await storage.getCommands();
    const newCommands = await fetchCommandsFromCms();
    const diff = findDiff(oldCommands, newCommands);
    await storage.setCommands(newCommands);

    const testCommands = await storage.getCommands();
    await bot.reply(message, "commnads updated. Check:");
    await bot.reply(message, `${JSON.stringify(newCommands)}`);
    await bot.reply(message, `diff: ${JSON.stringify(diff)}`);
  } catch (error) {
    bot.reply(message, `error reloading: ${error.message}`);
  }
});

controller.hears("debug", "direct_message", async (bot, message) => {
  const commands = await storage.getCommands();
  bot.reply(message, JSON.stringify(commands));
});

controller.webserver.get("/", (req, res) => {
  res.send(`This app is running Botkit ${controller.version}.`);
});

controller.webserver.get("/install", (req, res) => {
  res.redirect(controller.adapter.getInstallLink());
});

controller.webserver.get("/install/auth", async (req, res) => {
  try {
    await controller.adapter.validateOauthCode(req.query.code);
    res.json("Success! Bot installed.");
  } catch (err) {
    console.error("OAUTH ERROR:", err);
    res.status(401);
    res.send(err.message);
  }
});
