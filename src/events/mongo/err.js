const chalk = require("chalk");

module.exports = {
  name: "err",
  async execute() {
    console.log(
      chalk.red(`An error occured with the database connection: \n${err}`)
    );
  },
};
