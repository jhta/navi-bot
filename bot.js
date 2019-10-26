require("dotenv").config();

const { Botkit } = require("botkit");
const createSlackAdapter = require("./slack-adapter");
const config = require("./config");
const consola = require("consola");

const createStorage = require("./storage");

const loadSkills = require("./skills");
const loadRoutes = require("./routes");

const adapter = createSlackAdapter(config);

const controller = new Botkit({
  webhook_uri: "/slack/receive",
  adapter: adapter,
  debug: process.env.NODE_ENV !== "production"
});

let storage = null;

controller.ready(async () => {
  consola.success("Navi running on port 3000");
  storage = await createStorage();
  loadRoutes(controller, storage);
  loadSkills(controller, { storage });
});
