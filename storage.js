const fs = require("fs");
const { promisify } = require("util");

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const readData = async () => {
  const res = await readFileAsync(".data.json");
  return JSON.parse(res);
};

const writeData = async commands => {
  let data = JSON.stringify(commands);
  await writeFileAsync(".data.json", data);
  return "done";
};

function Storage(initial = {}) {
  this.commands = initial;
  writeData(initial);
  this.setCommands = async commands => {
    this.commands = commands;
    await writeData(commands);
  };
  this.getCommands = async () => await readData();
}

module.exports = Storage;
