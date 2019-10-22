module.exports = (controller, options) => {
  const { storage } = options;
  controller.hears("update_cms", "direct_message", async (bot, message) => {
    try {
      await storage.setCommands();

      const testCommands = await storage.getCommands();
      await bot.reply(message, "commnads updated. Check:");
      await bot.reply(message, `${JSON.stringify(testCommands)}`);
    } catch (error) {
      bot.reply(message, `error reloading: ${error.message}`);
    }
  });
};
