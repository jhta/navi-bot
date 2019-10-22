require("dotenv").config();

const { Botkit } = require("botkit");

const fetchCommandsFromCms = require("./cms");
const createSlackAdapter = require("./slack-adapter");
const config = require("./config");

const Skills = require("./skills");
const cms = require("./skills/cms");

// const createStorage = require("./storage");
// const loadRoutes = require("./routes");

const adapter = createSlackAdapter(config);

const controller = new Botkit({
  webhook_uri: "/slack/receive",
  json_file_store: "./db_slackbutton_slash_command/",
  adapter: adapter,
  debug: process.env.NODE_ENV !== "production"
});

// loadRoutes(controller);

let storage = null;

controller.ready(async () => {
  // load routes
  // controller.loadModules(__dirname + "/routes");

  // const initCommands = await fetchCommandsFromCms();
  // storage = await createStorage();

  Skills.hello(controller);
  // Skills.help(controller, { storage });
  // cms(controller, { storage });
});

// controller.hears("update_cms", "direct_message", async (bot, message) => {
//   try {
//     await storage.setCommands();

//     const testCommands = await storage.getCommands();
//     await bot.reply(message, "commnads updated. Check:");
//     await bot.reply(message, `${JSON.stringify(testCommands)}`);
//     // await bot.reply(message, `diff: ${JSON.stringify(diff)}`);
//   } catch (error) {
//     bot.reply(message, `error reloading: ${error.message}`);
//   }
// });

// controller.hears("debug", "direct_message", async (bot, message) => {
//   await storage.setCommands();
//   const commands = await storage.getCommands();
//   bot.reply(message, JSON.stringify(commands));
// });

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

controller.webserver.post("/update_cms", async (req, res) => {
  // await storage.setCommands();
  res.json("storage updated :) ");
});
