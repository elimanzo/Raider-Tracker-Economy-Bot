const Balance = require("../../schemas/balance");
const { SlashCommandBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bankrupt")
    .setDescription("The bank will remove the user from the economy")
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
    const balanceProfile = await Balance.findOneAndDelete({ guildMemberId: user.id, guildId: interaction.guild.id});
    if(!balanceProfile) {
        await interaction.reply({ content: `<@${user.id}> was not part of the Economy`});
    } else {
        
        await interaction.reply({ content: `<@${user.id}> went bankrupt, lost $${balanceProfile.amount}, and is not longer part of the Economy`});
    }
  },
};
