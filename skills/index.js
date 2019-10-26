const hello = require("./hello");
const help = require("./help");
const cms = require("./cms");
const updateCms = require("./update-cms");
const debug = require("./debug");

const skills = [hello, help, cms, debug, updateCms];

const loadSkills = (controller, options) => {
  skills.forEach(skill => {
    skill(controller, options);
  });
};

module.exports = loadSkills;
