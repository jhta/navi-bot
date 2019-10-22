const get = require("lodash/get");

module.exports = (controller, options) => {
  const { storage } = options;

  controller.hears(
    async message => {
      const commands = await storage.getCommands();
      const msg = get(message, "text", "").toLowerCase();
      return Boolean(commands[msg]);
    },
    "direct_message",
    async (bot, message) => {
      const commands = await storage.getCommands();
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
