require("dotenv").config();

const { Botkit } = require("botkit");
const createSlackAdapter = require("./slack-adapter");
const config = require("./config");
const Skills = require("./skills");

const createStorage = require("./storage");
// const loadRoutes = require("./routes");

const adapter = createSlackAdapter(config);

const controller = new Botkit({
  webhook_uri: "/slack/receive",
  json_file_store: "./db_slackbutton_slash_command/",
  adapter: adapter,
  debug: process.env.NODE_ENV !== "production"
});

let storage = null;

controller.ready(async () => {
  // load routes
  // controller.loadModules(__dirname + "/routes");

  storage = await createStorage();

  Skills.hello(controller);
  Skills.help(controller, { storage });
  Skills.cms(controller, { storage });
  Skills.debug(controller, { storage });
  Skills.updateCms(controller, { storage });
});

controller.webserver.get("/", async (req, res) => {
  await storage.setCommands();
  const commands = await storage.getCommands();
  const message = `
    <h1>This app is running Botkit ${controller.version}.</h1>
    the current commands:
    ${JSON.stringify(commands)}
  `;
  res.send(message);
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
  await storage.setCommands();
  res.json("storage updated :) ");
});
