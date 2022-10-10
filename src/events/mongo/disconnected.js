const chalk = require("chalk");

module.exports = {
  name: "Disconnected",
  async execute() {
    console.log(chalk.red("[Database Status]: Disconnected."));
  },
};
