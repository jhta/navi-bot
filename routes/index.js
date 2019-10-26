const home = require("./home");
const install = require("./install");
const oauth = require("./oauth");
const updateCms = require("./update_cms");

const loadRoutes = (controller, storage) => {
  home(controller, storage);
  install(controller);
  oauth(controller);
  updateCms(controller, storage);
};

module.exports = loadRoutes;
