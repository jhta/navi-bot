module.exports = controller => {
  controller.webserver.get("/install", (req, res) => {
    res.redirect(controller.adapter.getInstallLink());
  });
};
