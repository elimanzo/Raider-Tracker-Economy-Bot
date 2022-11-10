const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-sale-client-scheduler")
    .setDescription("Updates client from Sale")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("sale")
        .setDescription("Shows a sale from the ID provided")
        .addStringOption((option) =>
          option.setName("sale_id").setDescription("Sale ID'")
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

    const threadId = interaction.channelId;
    const saleId = interaction.options.getString("sale_id");
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
          content: `Command \`/show-sale\` is not in it\'s appropriate Sale Thread`,
          ephemeral: true,
        });
        return;
      }
    }

    const modal = new ModalBuilder()
      .setCustomId(`raiderUpdateSaleClientForm`)
      .setTitle(`Sale`);
    const modalSaleId = new TextInputBuilder()
      .setCustomId("saleId")
      .setLabel(`Sale ID (Don't Change This)`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Sale ID")
      .setValue(`${saleProfile._id}`);
    const clientDiscordId = new TextInputBuilder()
      .setCustomId("clientId")
      .setLabel(`Client's Discord ID`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Client's Discord ID")
      .setValue(`${saleProfile.clientId}`);
      const schedulerDiscordId = new TextInputBuilder()
      .setCustomId("schedulerId")
      .setLabel(`Scheduler's Discord ID`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Scheduler's Discord ID")
      .setValue(`${saleProfile.scheduler}`);
    modal.addComponents(
      new ActionRowBuilder().addComponents(modalSaleId),
      new ActionRowBuilder().addComponents(clientDiscordId),
      new ActionRowBuilder().addComponents(schedulerDiscordId)
    );
    await interaction.showModal(modal);
  },
};
