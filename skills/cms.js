const get = require("lodash/get");

const createCmsMessagesMatcher = (commands = {}) => message => {
  const msg = get(message, "text", "").toLowerCase();
  return Boolean(commands[msg]);
};

module.exports = (controller, options) => {
  const { commands } = options;
  const cmsMessagesMatcher = createCmsMessagesMatcher(commands);

  controller.hears(
    cmsMessagesMatcher,
    "direct_message",
    async (bot, message) => {
      if (!Object.values(commands)) {
        await bot.reply(message, "there is not commands available");
        return null;
      }

      const msg = get(message, "text", "").toLowerCase();
      const response = commands[msg] ? commands[msg] : "Sorry, I don't get it.";
      await bot.reply(message, response);
    }
  );
};
