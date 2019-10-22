const hello = require("./hello");
const help = require("./help");
const cms = require("./cms");
const updateCms = require("./update-cms");
const debug = require("./debug");

const Skills = {
  hello: hello,
  help: help,
  cms: cms,
  debug: debug,
  updateCms: updateCms
};

module.exports = Skills;
