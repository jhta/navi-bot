module.exports = (controller, options) => {
  const { storage } = options;
  controller.hears("debug", "direct_message", async (bot, message) => {
    const commands = await storage.getCommands();
    bot.reply(message, JSON.stringify(commands));
  });
};
