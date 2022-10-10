const Balance = require("../../schemas/balance");
const { SlashCommandBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Return information based on a user's balance.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Gets information of a user mentioned")
        .addUserOption((option) =>
          option.setName("target").setDescription("The user mentioned")
        )
    ),
  async execute(interaction, client) {
    let user = (interaction.options.getUser("target") ? interaction.options.getUser("target") : interaction.user);
    const balanceProfile = await client.createBalance(interaction.member);
    await interaction.reply({ content: `<@${user.id}> has $${balanceProfile.amount}.`});
    
  },
};
