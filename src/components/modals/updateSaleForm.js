const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: `raiderUpdateSaleForm`,
  },
  async execute(interaction, client) {
    let saleCost = 0;
    const saleId = interaction.fields.getTextInputValue("saleId").trim();
    const saleType = interaction.fields.getTextInputValue("saleType");
    const saleDate = new Date(interaction.fields.getTextInputValue("saleDate"));
    const raiderIds = interaction.fields
      .getTextInputValue("raiderIds")
      .split(",")
      .map(function (value) {
        return value.trim();
      });
    const gilAmounts = interaction.fields
      .getTextInputValue("gilAmounts")
      .split(",")
      .map(function (value) {
        return value.trim();
      });

    // Input Validation

    for (let i = 0; i < raiderIds.length; i++) {
      const raiderProfile = await client.findRaider(
        interaction.member,
        raiderIds[i]
      );
      if (!raiderProfile) {
        await interaction.reply({
          content: ` <@${raiderIds[i]}> does not exist, use \`/create-raider user discord_id:<@${raiderIds[i]}>\` to create a new Raider `,
        });
        return;
      }
    }

    let saleProfile = await client.findRaiderSale(saleId);

    if (!saleProfile) {
      await interaction.reply({
        content: `Sale ID: **${saleId}** was changed (Do not change the sale ID in the update form) `,
      });
      return;
    }

    if (!(saleDate instanceof Date) || isNaN(saleDate)) {
      await interaction.reply({
        content:
          "Invalid Date Input (Make sure the date has the correct format (YYYY-MM-DD)",
      });
      return;
    }

    if (gilAmounts.length !== raiderIds.length) {
      await interaction.reply({
        content:
          "Invalid User Input (total amount of Raider IDs/Gil Amounts do not match)",
      });
      return;
    }

    for (let i = 0; i < raiderIds.length; i++) {
      if (
        isNaN(raiderIds[i]) ||
        isNaN(gilAmounts[i]) ||
        Number(gilAmounts[i]) <= 0
      ) {
        await interaction.reply({
          content:
            "Invalid User Input (Raider IDs/Gil Amounts were either not a number or a number <= 0)",
        });
        return;
      }
      gilAmounts[i] = Number(gilAmounts[i]);
      saleCost += Number(gilAmounts[i]);
    }

    const oldRaiderPayment = saleProfile.raiders.raiderIds.map(
      function (x, i) {
        return { raiderId: x, gil: saleProfile.raiders.raiderPayout[i] };
      }.bind(this)
    );
    const newRaiderPayment = raiderIds.map(
      function (x, i) {
        return { raiderId: x, gil: gilAmounts[i] };
      }.bind(this)
    );
    const removeFundsMap = oldRaiderPayment.filter(
      (a) =>
        !newRaiderPayment.some(
          (b) => a.raiderId === b.raiderId && a.gil === b.gil
        )
    );
    const addFundsMap = newRaiderPayment.filter(
      (a) =>
        !oldRaiderPayment.some(
          (b) => a.raiderId === b.raiderId && a.gil === b.gil
        )
    );

    saleProfile = await client.updateRaiderSale(
      saleId,
      saleType,
      saleDate,
      saleCost,
      raiderIds,
      gilAmounts
    );

    // Updates every Raider that completed the sale

    for (let i = 0; i < removeFundsMap.length; i++) {
      const raiderProfile = await client.changeFunds(
        interaction.member,
        removeFundsMap[i].raiderId,
        -removeFundsMap[i].gil,
        saleProfile._id.toString()
      );
    }

    for (let i = 0; i < addFundsMap.length; i++) {
      const raiderProfile = await client.changeFunds(
        interaction.member,
        addFundsMap[i].raiderId,
        addFundsMap[i].gil,
        saleProfile._id.toString()
      );
    }
    await interaction.reply({
      content: `**${saleProfile.saleType}** has been updated use \`/show-sale sale  sale_id:${saleProfile._id}\` to get more info`,
    });
  },
};
