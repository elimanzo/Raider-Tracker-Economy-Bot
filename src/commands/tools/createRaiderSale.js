const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-sale-form")
    .setDescription("Return a completed sale form")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("client")
        .setDescription("Creates a Sale associated with the Client mentioned")
        .addUserOption((option) =>
          option
            .setName("client_id")
            .setDescription(
              "The client mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
            )
            .setRequired(true)
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
    const clientId = interaction.options.getUser("client_id");

    if (clientId) {
      const modal = new ModalBuilder()
        .setCustomId(`raiderSaleForm`)
        .setTitle(`Raider Sale - ${clientId.username.substr(0, 10)}`);
      const clientDiscordId = new TextInputBuilder()
        .setCustomId("clientId")
        .setLabel(`Client's Discord ID (Don't Change this)`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Client's Discord ID")
        .setValue(`${clientId.id}`);
      const saleType = new TextInputBuilder()
        .setCustomId("saleType")
        .setLabel(`Content`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Input what Content(s) was sold");
      const saleDate = new TextInputBuilder()
        .setCustomId("saleDate")
        .setLabel(`Date of Sale`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Date (MM/DD/YYYY HH:MM AM/PM TIMEZONE)");
      const raiderIds = new TextInputBuilder()
        .setCustomId("raiderIds")
        .setLabel(`Raider(s) Discord ID(s)`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Input Raider Discord IDs (Comma Seperated)");
      const gilAmounts = new TextInputBuilder()
        .setCustomId("gilAmounts")
        .setLabel(`Raider(s) gil made from sale`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(
          "Input Raiders Payout (Comma Seperated and should match the order above)"
        );

      modal.addComponents(
        new ActionRowBuilder().addComponents(clientDiscordId),
        new ActionRowBuilder().addComponents(saleType),
        new ActionRowBuilder().addComponents(saleDate),
        new ActionRowBuilder().addComponents(raiderIds),
        new ActionRowBuilder().addComponents(gilAmounts)
      );

      await interaction.showModal(modal);
    } else {
      await interaction.reply({
        content: ` Please mention the client. right click user and copy ID. then run \`/create-sale-form client client_id:<@discord_id>\` `,
      });
      return;
    }
  },
};
