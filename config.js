module.exports = {
  // REMOVE THIS OPTION AFTER YOU HAVE CONFIGURED YOUR APP!
  // enable_incomplete: true,

  // parameters used to secure webhook endpoint
  verificationToken: process.env.VERIFICATION_TOKEN,
  clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
  // auth token for a single-team app
  botToken: process.env.BOT_OAUTH_ACCESS_TOKEN,
  // credentials used to set up oauth for multi-team apps
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scopes: ["bot"],
  redirectUri: "https://fac5db25.ngrok.io/install/auth"
  // functions required for retrieving team-specific info
  // for use in multi-team apps
  // getTokenForTeam: getTokenForTeam,
  // getBotUserByTeam: getBotUserByTeam
};
