const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: `raiderUpdateForm`,
  },
  async execute(interaction, client) {
    const userName = interaction.fields.getTextInputValue("userName");
    const discordId = interaction.fields.getTextInputValue("discordId").trim();
    const lastSale = new Date(interaction.fields.getTextInputValue("lastSale"));
    const gilProfit = interaction.fields.getTextInputValue("gilProfit");
    const sales = interaction.fields
      .getTextInputValue("sales")
      .split(",")
      .map(function (value) {
        return value.trim();
      });

    // Input Validation

    for (let i = 0; i < sales.length; i++) {
      const saleProfile = await client.findRaiderSale(sales[i]);
      if (!saleProfile) {
        await interaction.reply({
          content: `Sale ID: **${sales[i]}** does not exist `,
        });
        return;
      }
    }

    if (!(lastSale instanceof Date) || isNaN(lastSale)) {
      await interaction.reply({
        content:
          "Invalid Date Input (Make sure the date has the correct format (YYYY-MM-DD)",
      });
      return;
    }

    if (isNaN(gilProfit) || Number(gilProfit) < 0) {
      await interaction.reply({
        content:
          "Invalid User Input (Gil Amount was either not a number or a number <= 0)",
      });
      return;
    }

    let raiderProfile = await client.updateRaider(
      interaction.member,
      discordId,
      userName,
      lastSale,
      Number(gilProfit),
      sales
    );
    if (!raiderProfile) {
      await interaction.reply({
        content: `No Discord ID was found (Do not change the discord ID in the update form)`,
      });
      return;
    }

    raiderProfile = await client.findRaider(
      interaction.member,
      discordId
    );

    await interaction.reply({
      content: `<@${raiderProfile.userId}> has been updated use \`/show-raider user discord_id:<@${discordId}>\` to get more info`,
      ephemeral: true
    });
  },
};
