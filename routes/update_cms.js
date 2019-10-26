module.exports = async (controller, storage) => {
  controller.webserver.post("/update_cms", async (req, res) => {
    await storage.setCommands();
    res.json("storage updated :) ");
  });
};
