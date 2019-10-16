const get = require("lodash/get");
const helloList = require("./constants").helloList;
const formattedList = helloList.map(h => h.toLowerCase());

const ifSayHello = async message =>
  formattedList.includes(get(message, "text", "").toLowerCase());

module.exports = controller => {
  controller.hears(ifSayHello, "direct_message", async (bot, message) => {
    const user = `<@${message.user}>`;
    await bot.reply(message, `Hello ${user}`);
  });
};
