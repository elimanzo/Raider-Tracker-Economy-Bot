const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-raider-to-sale")
    .setDescription("Return a completed sale form")
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

    const saleProfile = await client.addRaiderToThreadSale(interaction.member, raider, profit, threadId);

    if (saleProfile) {
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
