const {
  SlackAdapter,
  SlackMessageTypeMiddleware,
  SlackEventMiddleware
} = require("botbuilder-adapter-slack");

const createSlackAdapter = config => {
  const adapter = new SlackAdapter(config);
  // Use SlackEventMiddleware to emit events that match their original Slack event types.
  adapter.use(new SlackEventMiddleware());
  // Use SlackMessageType middleware to further classify messages as direct_message, direct_mention, or mention
  adapter.use(new SlackMessageTypeMiddleware());
  return adapter;
};

module.exports = createSlackAdapter;
