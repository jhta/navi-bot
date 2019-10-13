//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the bootone bot.

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

// const { MongoDbStorage } = require("botbuilder-storage-mongodb");

// Load process.env values from .env file
require("dotenv").config();

// let storage = null;
// if (process.env.MONGO_URI) {
//   storage = mongoStorage = new MongoDbStorage({
//     url: process.env.MONGO_URI
//   });
// }

const adapter = new SlackAdapter({
  // REMOVE THIS OPTION AFTER YOU HAVE CONFIGURED YOUR APP!
  // enable_incomplete: true,

  // parameters used to secure webhook endpoint
  verificationToken: process.env.VERIFICATION_TOKEN,
  clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
  // auth token for a single-team app
  botToken: process.env.BOT_OAUTH_ACCESS_TOKEN,
  // credentials used to set up oauth for multi-team apps
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scopes: ["bot"],
  redirectUri: "https://fac5db25.ngrok.io/install/auth",

  // functions required for retrieving team-specific info
  // for use in multi-team apps
  getTokenForTeam: getTokenForTeam,
  getBotUserByTeam: getBotUserByTeam
});

// Use SlackEventMiddleware to emit events that match their original Slack event types.
adapter.use(new SlackEventMiddleware());

// Use SlackMessageType middleware to further classify messages as direct_message, direct_mention, or mention
adapter.use(new SlackMessageTypeMiddleware());

const controller = new Botkit({
  webhook_uri: "/slack/receive",
  json_file_store: "./db_slackbutton_slash_command/",
  adapter: adapter,
  debug: true
  // storage
});

if (process.env.cms_uri) {
  controller.usePlugin(
    new BotkitCMSHelper({
      uri: process.env.cms_uri,
      token: process.env.cms_token
    })
  );
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(async () => {
  // load traditional developer-created local custom feature modules
  // controller.loadModules(__dirname + "/features");

  // /* catch-all that uses the CMS to trigger dialogs */
  // if (controller.plugins.cms) {
  //   controller.on("message,direct_message", async (bot, message) => {
  //     let results = false;
  //     results = await controller.plugins.cms.testTrigger(bot, message);

  //     if (results !== false) {
  //       // do not continue middleware!
  //       return false;
  //     }
  //   });
  // }

  const commands = await fetchCommandsFromCms();

  // console.log("===========================--");
  // console.log("commands", commands);
  // console.log("===========================--");

  const friendlyCommands =
    `\n` +
    Object.keys(commands)
      .map(c => `* ${c}`)
      .join(`\n`);

  console.log("friendly commands:", friendlyCommands);

  controller.hears(
    ["list", "commands", "help"],
    "message,direct_message",
    async (bot, message) => {
      await bot.reply(message, "Hey!, listen! I respond to:");
      await bot.reply(message, friendlyCommands);
    }
  );

  controller.hears("hi", "direct_message", async (bot, message) => {
    await bot.reply(message, "Hello.");
  });

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

  controller.hears(
    async message => message.text && message.text.toLowerCase() === "foo",
    ["message"],
    async (bot, message) => {
      await bot.reply(message, 'I heard "foo" via a function test');
    }
  );

  Object.keys(commands).forEach(command => {
    controller.hears(command, async (bot, message) => {
      await bot.reply(message, commands[command]);
    });
  });
});

controller.webserver.get("/", (req, res) => {
  res.send(`This app is running Botkit ${controller.version}.`);
});

controller.webserver.get("/install", (req, res) => {
  // getInstallLink points to slack's oauth endpoint and includes clientId and scopes
  res.redirect(controller.adapter.getInstallLink());
});

let tokenCache = {};
let userCache = {};
controller.webserver.get("/install/auth", async (req, res) => {
  try {
    const results = await controller.adapter.validateOauthCode(req.query.code);
    console.log("FULL OAUTH DETAILS", results);
    // Store token by team in bot state.
    tokenCache[results.team_id] = results.bot.bot_access_token;
    // Capture team to bot id
    userCache[results.team_id] = results.bot.bot_user_id;
    res.json("Success! Bot installed.");
  } catch (err) {
    console.error("OAUTH ERROR:", err);
    res.status(401);
    res.send(err.message);
  }
});

// controller.webserver.post("/slack/receive", async (req, res) => {
//   // respond to Slack that the webhook has been received.
//   console.log("response, receive webserver", req.body);
//   res.status(200);
//   res.send({ challenge: req.body.challenge });

//   // Now, pass the webhook into be processed
//   // controller.handleWebhookPayload(req, res);
// });

if (process.env.TOKENS) {
  tokenCache = JSON.parse(process.env.TOKENS);
}

if (process.env.USERS) {
  userCache = JSON.parse(process.env.USERS);
}

async function getTokenForTeam(teamId) {
  if (tokenCache[teamId]) {
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(tokenCache[teamId]);
      }, 150);
    });
  } else {
    console.error("Team not found in tokenCache: ", teamId);
  }
}

async function getBotUserByTeam(teamId) {
  if (userCache[teamId]) {
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(userCache[teamId]);
      }, 150);
    });
  } else {
    console.error("Team not found in userCache: ", teamId);
  }
}

// Log every message received
controller.middleware.receive.use(function(bot, message, next) {
  // log it
  console.log("RECEIVED: ", message);

  // modify the message
  message.logged = true;

  // continue processing the message
  next();
});
