module.exports = (controller, storage) => {
  controller.webserver.get("/", async (req, res) => {
    await storage.setCommands();
    const commands = await storage.getCommands();
    const message = `
      <h1>This app is running Botkit ${controller.version}.</h1>
      the current commands:
      ${JSON.stringify(commands)}
    `;
    res.send(message);
  });
};
