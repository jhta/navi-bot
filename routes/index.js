const home = require("./home");
const install = require("./install");
const oauth = require("./oauth");

const loadRoutes = controller => {
  home(controller);
  install(controller);
  oauth(controller);
};

export default loadRoutes;
