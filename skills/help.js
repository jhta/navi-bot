const getFriendlyCommands = commands =>
  `\n` +
  Object.keys(commands)
    .map(c => `* ${c}`)
    .join(`\n`);

module.exports = (controller, options) => {
  const { commands } = options;
  const friendlyCommands = getFriendlyCommands(commands);

  controller.hears(
    ["list", "commands", "help"],
    "message,direct_message",
    async (bot, message) => {
      await bot.reply(message, "Hey!, listen! I respond to:");
      await bot.reply(message, friendlyCommands);
    }
  );
};
