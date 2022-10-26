const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-raider")
    .setDescription("Deletes a Raider")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Deletes Raider for the user mentioned")
        .addUserOption((option) =>
          option
            .setName("discord_id")
            .setDescription(
              "The client mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
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
      .setCustomId(`raiderDeleteForm`)
      .setTitle(`Deleting Raider`);
    const discordId = new TextInputBuilder()
      .setCustomId("discordId")
      .setLabel(
        `${user.username.substr(0, 10)}'s Discord ID (Don't Change this)`
      )
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Raider's Discord ID")
      .setValue(`${user.id}`);
    const confirmation = new TextInputBuilder()
      .setCustomId("confirmation")
      .setLabel(`Confirmation`)
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Yes/No");

    modal.addComponents(
      new ActionRowBuilder().addComponents(discordId),
      new ActionRowBuilder().addComponents(confirmation)
    );

    await interaction.showModal(modal);
  },
};
