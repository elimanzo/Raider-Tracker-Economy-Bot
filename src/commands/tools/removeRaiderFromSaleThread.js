const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-raider-from-sale")
    .setDescription("Return a completed sale form")
    .addUserOption((option) =>
      option
        .setName("raider_id")
        .setDescription(
          "The raider mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("confirmation")
        .setDescription("To confirm cancelation type `yes`")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.SCHEDULER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }

    const raider = interaction.options.getUser("raider_id");
    const threadId = interaction.channelId;
    const confirmation = interaction.options.getString("confirmation");
    if (confirmation.toUpperCase() !== "YES") { 
      await interaction.reply({
        content: `${raider} was not removed`,
        ephemeral: true
      });
      return;
    } 

    const saleProfile = await client.removeRaiderFromThreadSale(
      interaction.member,
      raider,
      threadId
    );

    if (saleProfile) {
      await interaction.reply({
        content: `${raider} was removed from the sale!`,
      });
    } else {
      await interaction.reply({
        content: `Raider did not exist in the sale or incorrect sale thread`,
      });
    }
  },
};
