require("dotenv").config();

const { Botkit } = require("botkit");

const fetchCommandsFromCms = require("./cms");
const createSlackAdapter = require("./slack-adapter");
const config = require("./config");

const Skills = require("./skills");

const adapter = createSlackAdapter(config);

const controller = new Botkit({
  webhook_uri: "/slack/receive",
  json_file_store: "./db_slackbutton_slash_command/",
  adapter,
  debug: process.env.NODE_ENV !== "production"
});

controller.ready(async () => {
  // load routes
  controller.loadModules(__dirname + "/routes");

  const commands = await fetchCommandsFromCms();

  Skills.Help(controller, { commands });
  Skills.hello(controller);
  Skills.Cms(controller, { commands });
});
