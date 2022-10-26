const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-raider")
    .setDescription(
      "Updates Raider information of the user or mentioned user"
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Updates information from user mentioned")
        .addUserOption((option) =>
          option
            .setName("discord_id")
            .setDescription(
              "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
            )
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
    let user = interaction.options.getUser("discord_id")
      ? interaction.options.getUser("discord_id")
      : interaction.user;
    const raiderProfile = await client.findRaider(
      interaction.member,
      user.id
    );
    if (!raiderProfile) {
      await interaction.reply({
        content: ` <@${user.id}> does not exist, use \`/create-raider user discord_id:<@${user.id}>\` to create a new Raider `,
      });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId(`raiderUpdateForm`)
      .setTitle(`${user.username.substr(0, 10)}'s Update Form`);
    const discordId = new TextInputBuilder()
      .setCustomId("discordId")
      .setLabel(
        `${user.username.substr(0, 10)}'s Discord ID (Don't Change This)`
      )
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Raider's Username")
      .setValue(`${raiderProfile.userId}`);
    const userName = new TextInputBuilder()
      .setCustomId("userName")
      .setLabel(`${user.username.substr(0, 10)}'s Username`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Raider's Username")
      .setValue(`${raiderProfile.userName}`);
    const lastSale = new TextInputBuilder()
      .setCustomId("lastSale")
      .setLabel(`Last Sale`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Date (YYYY-MM-DD)")
      .setValue(`${raiderProfile.lastSale}>`);
    const gilProfit = new TextInputBuilder()
      .setCustomId("gilProfit")
      .setLabel(`Total Gil Made`)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Gil")
      .setValue(`${raiderProfile.gilProfit}`);
    const sales = new TextInputBuilder()
      .setCustomId("sales")
      .setLabel(`Sales`)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Sales")
      .setValue(`${String(raiderProfile.sales)}`);
    modal.addComponents(
      new ActionRowBuilder().addComponents(discordId),
      new ActionRowBuilder().addComponents(userName),
      new ActionRowBuilder().addComponents(lastSale),
      new ActionRowBuilder().addComponents(gilProfit),
      new ActionRowBuilder().addComponents(sales)
    );

    await interaction.showModal(modal);
  },
};
