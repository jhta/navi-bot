const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

const fetchCommandsFromCms = require("./cms");
const adapter = new FileAsync(".data.json");

async function createStorage() {
  const initCommands = await fetchCommandsFromCms();
  const db = await low(adapter);
  await db.set("commands", initCommands).write();

  const getCommands = async () => {
    const commands = await db.get("commands").value();
    return commands;
  };

  const setCommands = async () => {
    const commands = await fetchCommandsFromCms();
    await db.set("commands", commands).write();
    return {
      result: "Success",
      commands
    };
  };

  return {
    getCommands,
    setCommands
  };
}

// const storage = createStorage();

// const sleep = milliseconds => {
//   return new Promise(resolve => setTimeout(resolve, milliseconds));
// };

// (async () => {
//   const storage = await createStorage({ a: 1 });
//   const commands1 = await storage.getCommands();
//   console.log(commands1);

//   await sleep(500);
//   await storage.setCommands({ b: 3 });
//   const commands2 = await storage.getCommands();
//   console.log(commands2);
// })();

module.exports = createStorage;
