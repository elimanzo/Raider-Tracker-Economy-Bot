require("dotenv").config();
const { DISCORD_TOKEN, DATABASE_TOKEN, CLIENT_ID, GUILD_ID, LEADER_ID, SCHEDULER_ID, RETIRED_ID } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({ intents: 32767 });
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(DISCORD_TOKEN);
(async () => {
  await connect(DATABASE_TOKEN).catch(console.error);
})();
