const Balance = require("../../schemas/balance");
const { SlashCommandBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Has a chance to giving coins to the user."),
  async execute(interaction, client) {
    const chance = Math.floor(Math.random() * 10) + 1;
    if (chance >= 1 && chance <= 3) {
      const array = [
        "Fine take my money...",
        "Take it, this is all I have",
        "Here is money",
      ];
      const coinsToGive = Math.floor(Math.random() * 7) + 2;
      const balanceProfile = await client.createBalance(interaction.member);
      await interaction.reply({ content: `${array[Math.floor(Math.random() * 2)]} | You were given $${coinsToGive}.`});
      await Balance.findOneAndUpdate(
        { guildMemberId: interaction.user.id, guildId: interaction.guild.id },
        {
          amount: balanceProfile.amount + coinsToGive,
          lastEdited: Date.now(),
        }
      );
    } else {
      const array = ["No. ", "I do not feel like it"];
      await interaction.reply({ content: array[Math.floor(Math.random())]});
    }
  },
};
