const getFriendlyCommands = commands =>
  `\n` +
  Object.keys(commands)
    .map(c => `* ${c}`)
    .join(`\n`);

module.exports = (controller, options) => {
  controller.hears(
    ["list", "commands", "help"],
    "message,direct_message",
    async (bot, message) => {
      const { storage } = options;
      const commands = await storage.getCommands();
      const friendlyCommands = getFriendlyCommands(commands);
      await bot.reply(message, "Hey!, listen! I respond to:");
      await bot.reply(message, friendlyCommands);
    }
  );
};
