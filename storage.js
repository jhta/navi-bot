function Storage(initial = {}) {
  this.commands = initial;
  this.setCommands = commands => {
    this.commands = commands;
  };
  this.getCommands = () => this.commands;
}

module.exports = Storage;
