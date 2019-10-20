const fs = require("fs");

const readData = () =>
  fs.readFile(".data.json", (err, data) => {
    if (err) throw err;
    return JSON.parse(data);
  });

const writeData = commands => {
  let data = JSON.stringify(commands);
  fs.writeFileSync(".data.json", data);
  return "done";
};

function Storage(initial = {}) {
  this.commands = initial;
  writeData(initial);
  this.setCommands = commands => {
    this.commands = commands;
    writeData(commands);
  };
  this.getCommands = readData;
}

module.exports = Storage;
