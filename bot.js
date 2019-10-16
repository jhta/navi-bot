require("dotenv").config();

const { Botkit } = require("botkit");

const fetchCommandsFromCms = require("./cms");
const createSlackAdapter = require("./slack-adapter");
const config = require("./config");

const Skills = require("./skills");
const cms = require("./skills/cms");

// const loadRoutes = require("./routes");

const adapter = createSlackAdapter(config);

const controller = new Botkit({
  webhook_uri: "/slack/receive",
  json_file_store: "./db_slackbutton_slash_command/",
  adapter: adapter,
  debug: process.env.NODE_ENV !== "production"
});

let commands = {};

// loadRoutes(controller);

controller.ready(async () => {
  // load routes
  // controller.loadModules(__dirname + "/routes");

  commands = await fetchCommandsFromCms();

  Skills.help(controller, { commands });
  Skills.hello(controller);
  cms(controller, { commands });
});

controller.hears("update_cms", "direct_message", async (bot, message) => {
  try {
    commands = await fetchCommandsFromCms();
    bot.reply(message, "commnads updated");
  } catch (error) {
    bot.reply(message, `error reloading: ${error.message}`);
  }
});

controller.hears("debug", "direct_message", async (bot, message) => {
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
    const results = await controller.adapter.validateOauthCode(req.query.code);
    res.json("Success! Bot installed.");
  } catch (err) {
    console.error("OAUTH ERROR:", err);
    res.status(401);
    res.send(err.message);
  }
});
