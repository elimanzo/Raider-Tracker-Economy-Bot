const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: `raiderUpdateSaleClientForm`,
  },
  async execute(interaction, client) {
    const saleId = interaction.fields.getTextInputValue("saleId").trim();
    const clientSaleId = interaction.fields.getTextInputValue("clientId").trim();
    const schedulerId = interaction.fields.getTextInputValue("schedulerId").trim();
    // Input Validation

    let saleProfile = await client.findRaiderSale(saleId);

    if (!saleProfile) {
      await interaction.reply({
        content: `Sale ID: **${saleId}** was changed (Do not change the sale ID in the update form) `,
      });
      return;
    }

    saleProfile = await client.updateRaiderSaleClientScheduler(saleId, clientSaleId, schedulerId);
    saleProfile = await client.findRaiderSale(saleId);
    await interaction.reply({
      content: `Client: <@${saleProfile.clientId}>\nScheduler:<@${saleProfile.scheduler}>\nSale: **${saleProfile.saleType}**\nUse \`/show-sale sale  sale_id:${saleProfile._id}\` for more info`,
    });
  },
};
