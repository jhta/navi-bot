require("dotenv").config();

const { Botkit } = require("botkit");

const fetchCommandsFromCms = require("./cms");
const createSlackAdapter = require("./slack-adapter");
const config = require("./config");

const Skills = require("./skills");

const loadRoutes = require("./routes");

const adapter = createSlackAdapter(config);

const controller = new Botkit({
  webhook_uri: "/slack/receive",
  json_file_store: "./db_slackbutton_slash_command/",
  adapter,
  debug: process.env.NODE_ENV !== "production"
});

let commands = {};

loadRoutes(controller);

controller.ready(async () => {
  // load routes
  // controller.loadModules(__dirname + "/routes");

  commands = await fetchCommandsFromCms();

  Skills.Help(controller, { commands });
  Skills.hello(controller);
  Skills.Cms(controller, { commands });
});

controller.hears("update_cms", "direct_message", async (bot, message) => {
  try {
    commands = await fetchCommandsFromCms();
    bot.reply(message, "commnads updated");
  } catch (error) {
    bot.reply(message, `error reloading: ${error.message}`);
  }
});
