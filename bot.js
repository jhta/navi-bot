//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the bootone bot.

require("dotenv").config();

// Import Botkit's core features
const { Botkit } = require("botkit");
const { BotkitCMSHelper } = require("botkit-plugin-cms");
const get = require("lodash/get");

const {
  SlackAdapter,
  SlackMessageTypeMiddleware,
  SlackEventMiddleware
} = require("botbuilder-adapter-slack");

const fetchCommandsFromCms = require("./cms");
const config = require("./config");

// Skills
const help = require("./skills/help");
const hello = require("./skills/hello");

const adapter = new SlackAdapter(config);
// Use SlackEventMiddleware to emit events that match their original Slack event types.
adapter.use(new SlackEventMiddleware());
// Use SlackMessageType middleware to further classify messages as direct_message, direct_mention, or mention
adapter.use(new SlackMessageTypeMiddleware());

const controller = new Botkit({
  webhook_uri: "/slack/receive",
  json_file_store: "./db_slackbutton_slash_command/",
  adapter: adapter,
  debug: process.env.NODE_ENV !== "production"
});

controller.ready(async () => {
  // load traditional developer-created local custom feature modules
  // controller.loadModules(__dirname + "/features");
  console.log("hey!");

  const commands = await fetchCommandsFromCms();
  help(controller, { commands });
  hello(controller);

  const cmsMessagesMatcher = async message => {
    const msg = get(message, "text", "").toLowerCase();
    return Boolean(commands[msg]);
  };

  controller.hears(
    cmsMessagesMatcher,
    "direct_message",
    async (bot, message) => {
      const msg = get(message, "text", "").toLowerCase();
      const response = commands[msg] ? commands[msg] : "Sorry, I don't get it.";
      await bot.reply(message, response);
    }
  );
});

controller.webserver.get("/", (req, res) => {
  res.send(`This app is running Botkit ${controller.version}.`);
});

controller.webserver.get("/install", (req, res) => {
  // getInstallLink points to slack's oauth endpoint and includes clientId and scopes
  res.redirect(controller.adapter.getInstallLink());
});

controller.webserver.get("/install/auth", async (req, res) => {
  try {
    const results = await controller.adapter.validateOauthCode(req.query.code);
    console.log("FULL OAUTH DETAILS", results);
    // Store token by team in bot state.
    // tokenCache[results.team_id] = results.bot.bot_access_token;
    // Capture team to bot id
    // userCache[results.team_id] = results.bot.bot_user_id;
    res.json("Success! Bot installed.");
  } catch (err) {
    console.error("OAUTH ERROR:", err);
    res.status(401);
    res.send(err.message);
  }
});
