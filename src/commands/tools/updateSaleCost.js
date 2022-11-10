const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-sale-cost")
    .setDescription("Return a completed sale form")
    .addIntegerOption((option) =>
      option
        .setName("gil")
        .setDescription("The total amount of gil the raider received")
        .setMinValue(1)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("sale_id").setDescription("The Sale ID of the sale")
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.SCHEDULER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }

    const threadId = interaction.channelId;
    const saleId = interaction.options.getString("sale_id");
    const profit = interaction.options.getInteger("gil");
    let saleProfile = null;
    if (saleId) {
      saleProfile = await client.findRaiderSale(saleId);
      if (!saleProfile) {
        await interaction.reply({
          content: `Sale ID: **${saleId}** does not exist `,
          ephemeral: true,
        });
        return;
      }
    } else {
      saleProfile = await client.findRaiderSaleByThread(
        interaction.member,
        threadId
      );
      if (!saleProfile) {
        await interaction.reply({
          content: `Command \`/update-sale-cost\` is not in its appropriate Sale Thread`,
          ephemeral: true,
        });
        return;
      }
    }
    await client.updateSaleTotalProfit(saleProfile, profit);
    await interaction.reply({
        content: `Total Gil Cost Updated: **${profit.toLocaleString()}**`,
      });
  },
};
