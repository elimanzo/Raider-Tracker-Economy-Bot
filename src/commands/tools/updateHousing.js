const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-housing")
    .setDescription("Updates Raider housing of the user or mentioned user")
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
    if (interaction.member._roles.indexOf(process.env.RAIDER_ID) === -1) {
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
      .setCustomId(`raiderHousingUpdateForm`)
      .setTitle(`Raider House Address Update`);
    const discordId = new TextInputBuilder()
      .setCustomId("discordId")
      .setLabel(
        `${user.username.substr(0, 10)}'s Discord ID (Don't Change this)`
      )
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Raider's Discord ID")
      .setValue(`${user.id}`);
    const dataCenter = new TextInputBuilder()
      .setCustomId("dataCenter")
      .setLabel(`Data Center`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Data Center")
      .setValue(`${raiderProfile.dataCenter}`);
    const server = new TextInputBuilder()
      .setCustomId("server")
      .setLabel(`Server`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Server")
      .setValue(`${raiderProfile.server}`);
    const address = new TextInputBuilder()
      .setCustomId("address")
      .setLabel(`House Address`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("House Address")
      .setValue(`${raiderProfile.houseAddress}`);

    modal.addComponents(
      new ActionRowBuilder().addComponents(discordId),
      new ActionRowBuilder().addComponents(dataCenter),
      new ActionRowBuilder().addComponents(server),
      new ActionRowBuilder().addComponents(address)
    );

    await interaction.showModal(modal);
  },
};
