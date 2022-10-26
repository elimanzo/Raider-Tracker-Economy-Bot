module.exports = {
  data: {
    name: `raiderSaleDeleteForm`,
  },
  async execute(interaction, client) {
    const saleId = interaction.fields.getTextInputValue("saleId").trim();
    const confirmation = interaction.fields.getTextInputValue("confirmation").trim();
    let saleProfile = await client.findRaiderSale(saleId);

    if (!saleProfile) {
      await interaction.reply({
        content: `Sale ID: **${saleId}** was changed (Do not change the sale ID in the update form) `,
      });
      return;
    }

    if (confirmation.toUpperCase() === "YES") {
      for (let i = 0; i < saleProfile.raiders.raiderIds.length; i++) {
        const raiderProfile = await client.changeFunds(
          interaction.member,
          saleProfile.raiders.raiderIds[i],
          -saleProfile.raiders.raiderPayout[i],
          saleProfile._id.toString()
        );
      }
      await client.deleteRaiderSale(saleId);
      await interaction.reply({
        content: `\`${saleId}\` is no longer a part of the Raider Sales Database`,
        ephemeral: true,
      });
      return;
    } else {
      await interaction.reply({
        content: `\`${saleId}\` was not deleted`,
        ephemeral: true,
      });
      return;
    }
  },
};
