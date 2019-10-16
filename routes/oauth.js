module.exports = controller => {
  controller.webserver.get("/install/auth", async (req, res) => {
    try {
      const results = await controller.adapter.validateOauthCode(
        req.query.code
      );
      res.json("Success! Bot installed.");
    } catch (err) {
      console.error("OAUTH ERROR:", err);
      res.status(401);
      res.send(err.message);
    }
  });
};
