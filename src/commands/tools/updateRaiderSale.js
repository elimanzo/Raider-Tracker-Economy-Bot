const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-sale")
    .setDescription("Updates Sale Information")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("sale")
        .setDescription("Shows sale from the ID provided")
        .addStringOption((option) =>
          option.setName("sale_id").setDescription("Sale ID'").setRequired(true)
        )
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.SCHEDULER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }
    const saleId = interaction.options.getString("sale_id");
    const saleProfile = await client.findRaiderSale(saleId);

    if (!saleProfile) {
      await interaction.reply({
        content: `Sale ID: **${saleId}** does not exist `,
      });
      return;
    }
    const modal = new ModalBuilder()
      .setCustomId(`raiderUpdateSaleForm`)
      .setTitle(`Roll Raider Sale`);
    const modalSaleId = new TextInputBuilder()
      .setCustomId("saleId")
      .setLabel(`Sale ID (Don't Change This)`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Roll Raider's Sale ID")
      .setValue(`${saleProfile._id}`);
    const saleType = new TextInputBuilder()
      .setCustomId("saleType")
      .setLabel(`Content`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Input what Content(s) was sold")
      .setValue(`${saleProfile.saleType}`);
    const saleDate = new TextInputBuilder()
      .setCustomId("saleDate")
      .setLabel(`Date of Sale`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Date (MM/DD/YYYY HH:MM AM/PM TIMEZONE)")
      .setValue(`${saleProfile.saleDate}`);
    const raiderIds = new TextInputBuilder()
      .setCustomId("raiderIds")
      .setLabel(`Raider(s) Discord ID(s)`)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Input Raider Discord IDs (Comma Seperated)")
      .setValue(`${String(saleProfile.raiders.raiderIds)}`);
    const gilAmounts = new TextInputBuilder()
      .setCustomId("gilAmounts")
      .setLabel(`Raider(s) gil made from sale`)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder(
        "Input Raiders Payout (Comma Seperated and should match the order above)"
      )
      .setValue(`${String(saleProfile.raiders.raiderPayout)}`);

    modal.addComponents(
      new ActionRowBuilder().addComponents(modalSaleId),
      new ActionRowBuilder().addComponents(saleType),
      new ActionRowBuilder().addComponents(saleDate),
      new ActionRowBuilder().addComponents(raiderIds),
      new ActionRowBuilder().addComponents(gilAmounts)
    );
    await interaction.showModal(modal);
  },
};
