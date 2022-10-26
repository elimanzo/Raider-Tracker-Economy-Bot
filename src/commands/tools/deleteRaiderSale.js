const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-sale")
    .setDescription("Deletes a Raider Sale")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("sale")
        .setDescription("Deletes Raider sale from the ID provided")
        .addStringOption((option) =>
          option.setName("sale_id").setDescription("Sale ID'").setRequired(true)
        )
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.LEADER_ID) === -1) {
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
      .setCustomId(`raiderSaleDeleteForm`)
      .setTitle(`Deleting Raider Sale`);
    const modalSaleId = new TextInputBuilder()
      .setCustomId("saleId")
      .setLabel(`Sale ID (Don't Change This)`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Raider's Sale ID")
      .setValue(`${saleProfile._id}`);
    const confirmation = new TextInputBuilder()
      .setCustomId("confirmation")
      .setLabel(`Confirmation`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Yes/No");

    modal.addComponents(
      new ActionRowBuilder().addComponents(modalSaleId),
      new ActionRowBuilder().addComponents(confirmation)
    );

    await interaction.showModal(modal);
  },
};
