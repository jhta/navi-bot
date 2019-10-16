module.exports = controller => {
  controller.webserver.get("/", (req, res) => {
    res.send(`This app is running Botkit ${controller.version}.`);
  });
};
