const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cancel-sale")
    .setDescription("Cancels an ongoing or completed sale")
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

    const confirmation = interaction.options.getString("confirmation");
    const threadId = interaction.channelId;

    if (confirmation.toUpperCase() === "YES") {
      const saleProfile = await client.findRaiderSaleByThread(
        interaction.member,
        threadId
      );
      if (!saleProfile) {
        await interaction.reply({
          content: `Sale does not exist or You must be in the appropriate sale thread`,
        });
        return;
      }
      for (let i = 0; i < saleProfile.raiders.totalRaiders; i++) {
        await client.changeFunds(
          interaction.member,
          saleProfile.raiders.raiderIds[i],
          -saleProfile.raiders.raiderPayout[i],
          saleProfile._id.toString(),
          true
        );
      }
      await interaction.reply({
        content: `Sale has been cancelled!`,
      });
      await client.deleteRaiderSaleThread(threadId);
      await interaction.channel.setName("CANCELLED");
      await interaction.channel.setLocked(true);
      await interaction.channel.setArchived(true);
      return;
    } else {
      await interaction.reply({
        content: `Sale was not deleted`,
        ephemeral: true,
      });
      return;
    }
  },
};
