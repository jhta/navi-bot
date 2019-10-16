const get = require("lodash/get");

const cmsMessagesMatcher = async (message, commands) => {
  const msg = get(message, "text", "").toLowerCase();
  return Boolean(commands[msg]);
};

module.exports = (controller, options) => {
  const { commands } = options;

  controller.hears(
    cmsMessagesMatcher,
    "direct_message",
    async (bot, message) => {
      const msg = get(message, "text", "").toLowerCase();
      const response = commands[msg] ? commands[msg] : "Sorry, I don't get it.";
      await bot.reply(message, response);
    }
  );
};
