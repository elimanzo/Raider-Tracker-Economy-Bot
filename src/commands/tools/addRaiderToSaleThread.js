const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-raider-to-sale")
    .setDescription("Adds Raider to an ongoing or completed sale")
    .addUserOption((option) =>
      option
        .setName("raider_id")
        .setDescription(
          "The raider mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("gil")
        .setDescription("The total amount of gil the raider received")
        .setMinValue(0)
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
    const profit = interaction.options.getInteger("gil");
    const threadId = interaction.channelId;

    const saleProfile = await client.findRaiderSaleByThread(
      interaction.member,
      threadId
    );

    if (saleProfile) {
      if (Date.now() < saleProfile.saleDate) {
        await interaction.reply({
          content: `You cannot add a raider till the roster is finalized`,
          ephemeral: true
        });
        return;
      }
      await client.addRaiderToThreadSale(
        interaction.member,
        raider,
        profit,
        threadId
      );
      await interaction.reply({
        content: `${raider} was added/updated`,
      });
    } else {
      await interaction.reply({
        content: `You must add a raider to its appropriate sale thread`,
      });
    }
  },
};
